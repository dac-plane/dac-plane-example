import type { Schemas } from "@dac-plane-example/surface-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { APIError, streamPath, surface, unwrap, useConfig } from "../api.ts";
import {
  formatTime,
  ProblemNotice,
  Section,
  StateBadge,
  StreamIndicator,
  shortID,
  useCommandKey,
} from "../components.tsx";
import { useEventStream } from "../events.ts";

type AttentionRequest = Schemas["attention-request.schema"];
type DecisionKind = Schemas["decision-request.schema"]["kind"];

const kindLabel: Record<AttentionRequest["kind"], string> = {
  question: "Question",
  action_approval: "Approval",
  authentication_handoff: "Sign-in needed",
  blocked_work: "Blocked",
};

/** The digest dac-plane records for an answer: SHA-256 of its UTF-8 bytes. */
export async function answerDigest(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const hex = [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sha256:${hex}`;
}

// ConnectorProposal shows the exact tool call an approval would let through.
// dac-plane serves it to the connection's owner only; anyone else, and an
// approval that is not a connector call, gets 404 and sees nothing here.
function ConnectorProposal({ tenant, request }: { tenant: string; request: AttentionRequest }) {
  const proposal = useQuery({
    queryKey: ["connector-call", tenant, request.attention_id, request.version],
    retry: false,
    queryFn: async () =>
      unwrap(
        await surface.GET("/v1/tenants/{tenant}/attention/{attention}/connector-call", {
          params: { path: { tenant, attention: request.attention_id } },
        }),
      ),
  });
  if (proposal.error instanceof APIError && proposal.error.status === 404) return null;
  if (proposal.error) return <ProblemNotice error={proposal.error} />;
  if (!proposal.data) return null;
  const stale = proposal.data.attention_version !== request.version;
  return (
    <div className="proposal">
      <p>
        Connector call <code>{proposal.data.tool}</code> on connection{" "}
        <span className="mono">{shortID(proposal.data.connection_id)}</span>
      </p>
      <pre className="mono">{JSON.stringify(proposal.data.input, null, 2)}</pre>
      <p className="muted mono">{proposal.data.input_digest}</p>
      {stale ? (
        <p className="problem">The request changed since this proposal; reload before deciding.</p>
      ) : null}
    </div>
  );
}

function AttentionCard({ tenant, request }: { tenant: string; request: AttentionRequest }) {
  const queryClient = useQueryClient();
  const command = useCommandKey();
  const [answer, setAnswer] = useState("");

  const decide = useMutation({
    mutationFn: async (kind: DecisionKind) => {
      const body =
        kind === "answer" ? { kind, answer_digest: await answerDigest(answer) } : { kind };
      return unwrap(
        await surface.POST("/v1/tenants/{tenant}/attention/{attention}/decisions", {
          params: {
            path: { tenant, attention: request.attention_id },
            // The decision is made on the version the person was shown; a
            // request that changed since is refused (412), not decided blind.
            header: { "Idempotency-Key": command.keyFor(body), "If-Match": `"${request.version}"` },
          },
          body,
        }),
      );
    },
    onSuccess: () => {
      command.done();
      return queryClient.invalidateQueries({ queryKey: ["attention"] });
    },
  });

  const pending = request.state === "pending";
  const approval = request.kind === "action_approval";

  return (
    <li className="row">
      <div className="row-main">
        <div>
          <strong>{kindLabel[request.kind]}</strong> <StateBadge state={request.state} /> ·{" "}
          <Link to={`/tasks/${request.task_id}`}>task {shortID(request.task_id)}</Link>
        </div>
        <p className="muted">
          Asked {formatTime(request.created_at)} · expires {formatTime(request.expires_at)}
        </p>
        {approval ? (
          <>
            <p className="muted mono">action {request.action_digest}</p>
            <ConnectorProposal tenant={tenant} request={request} />
          </>
        ) : (
          <p className="muted">
            dac-plane does not yet serve the words of a question or deliver the words of an answer
            (dac-plane#157). It records the SHA-256 digest of what you write here.
          </p>
        )}
      </div>
      {pending ? (
        approval ? (
          <div className="actions">
            <button
              type="button"
              disabled={decide.isPending}
              onClick={() => decide.mutate("approve_once")}
            >
              Approve once
            </button>
            <button
              type="button"
              className="secondary"
              disabled={decide.isPending}
              onClick={() => {
                if (window.confirm("Approve this action standing, for later requests too?")) {
                  decide.mutate("approve_standing");
                }
              }}
            >
              Always approve
            </button>
            <button
              type="button"
              className="danger"
              disabled={decide.isPending}
              onClick={() => decide.mutate("deny")}
            >
              Deny
            </button>
          </div>
        ) : (
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              decide.mutate("answer");
            }}
          >
            <label>
              Answer
              <textarea
                required
                rows={2}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </label>
            <div className="actions">
              <button type="submit" disabled={decide.isPending || answer.trim() === ""}>
                Send answer
              </button>
              <button
                type="button"
                className="danger"
                disabled={decide.isPending}
                onClick={() => decide.mutate("deny")}
              >
                Deny
              </button>
            </div>
          </form>
        )
      ) : null}
      {decide.data ? (
        <p className="muted">
          Decided: {decide.data.kind.replaceAll("_", " ")} ({decide.data.state})
        </p>
      ) : null}
      <ProblemNotice error={decide.error} />
    </li>
  );
}

export function AttentionPage() {
  const config = useConfig();
  const tenant = config.data?.tenant;
  const queryClient = useQueryClient();
  const attention = useQuery({
    queryKey: ["attention", tenant],
    enabled: tenant !== undefined,
    queryFn: async () =>
      unwrap(
        await surface.GET("/v1/tenants/{tenant}/attention", {
          params: { path: { tenant: tenant ?? "" } },
        }),
      ).attention,
  });
  // The list is read again whenever an attention request changes anywhere
  // in the tenant.
  const stream = useEventStream(tenant ? streamPath(tenant) : undefined, {
    onEvent: (event) => {
      if (event.record_kind === "attention_request") {
        void queryClient.invalidateQueries({ queryKey: ["attention"] });
      }
    },
    onReset: () => void queryClient.invalidateQueries({ queryKey: ["attention"] }),
  });

  if (config.error) return <ProblemNotice error={config.error} />;
  if (!tenant) return <p className="muted">Loading…</p>;
  return (
    <Section title="Waiting on you" actions={<StreamIndicator state={stream} />}>
      <ProblemNotice error={attention.error} />
      {attention.isSuccess && attention.data.length === 0 ? (
        <p className="muted">Nothing is waiting on you.</p>
      ) : null}
      <ul className="list">
        {(attention.data ?? []).map((request) => (
          <AttentionCard key={request.attention_id} tenant={tenant} request={request} />
        ))}
      </ul>
    </Section>
  );
}
