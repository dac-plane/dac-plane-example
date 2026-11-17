import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  type Event,
  streamPath,
  surface,
  type TaskView,
  unwrap,
  useConfig,
  versioned,
} from "../api.ts";
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

const terminal = new Set(["succeeded", "failed", "rejected", "cancelled"]);

function TaskDetail({ tenant, id }: { tenant: string; id: string }) {
  const queryClient = useQueryClient();
  const cancel = useCommandKey();
  const [events, setEvents] = useState<Event[]>([]);

  const task = useQuery({
    queryKey: ["task-versioned", tenant, id],
    queryFn: async () =>
      versioned(
        await surface.GET("/v1/tenants/{tenant}/tasks/{task}", {
          params: { path: { tenant, task: id } },
        }),
      ),
  });
  const agents = useQuery({
    queryKey: ["agents", tenant],
    queryFn: async () =>
      unwrap(await surface.GET("/v1/tenants/{tenant}/agents", { params: { path: { tenant } } }))
        .agents,
  });

  // Every event changes the record, so the task is read again; the stream
  // says that something changed, the read says what it is now.
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["task-versioned", tenant, id] });
  const stream = useEventStream(streamPath(tenant, id), {
    onEvent: (event) => {
      setEvents((current) => [...current, event]);
      void refresh();
    },
    onReset: () => {
      setEvents([]);
      void refresh();
    },
  });

  const cancelTask = useMutation({
    mutationFn: async () => {
      if (!task.data) throw new Error("The task has not been read yet.");
      return unwrap(
        await surface.POST("/v1/tenants/{tenant}/tasks/{task}/cancel", {
          params: {
            path: { tenant, task: id },
            header: {
              "Idempotency-Key": cancel.keyFor({ cancel: id }),
              "If-Match": task.data.etag,
            },
          },
          body: {},
        }),
      );
    },
    onSuccess: () => {
      cancel.done();
      return refresh();
    },
  });

  if (task.error) return <ProblemNotice error={task.error} />;
  if (!task.data) return <p className="muted">Loading task…</p>;

  const view = task.data.value;
  const { task: record, attempt } = view;
  const agent = record.agent
    ? agents.data?.find((a) => a.agent_id === record.agent?.agent_id)
    : undefined;

  return (
    <>
      <Section
        title={record.objective ?? "Task"}
        actions={
          <>
            <StateBadge state={record.state} />
            {terminal.has(record.state) || record.state === "cancelling" ? null : (
              <button
                type="button"
                className="danger"
                disabled={cancelTask.isPending}
                onClick={() => {
                  if (window.confirm("Request cancellation of this task?")) cancelTask.mutate();
                }}
              >
                Cancel task
              </button>
            )}
          </>
        }
      >
        <ProblemNotice error={cancelTask.error} />
        <dl className="facts">
          <dt>Agent</dt>
          <dd>
            {record.agent ? (
              <>
                {agent?.name ?? shortID(record.agent.agent_id)}{" "}
                <span className="muted">at revision {record.agent.revision}</span>
              </>
            ) : (
              <span className="muted">Submitted to providers directly</span>
            )}
          </dd>
          <dt>Acceptance criteria</dt>
          <dd>
            <ul>
              {(record.acceptance_criteria ?? []).map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          </dd>
          <dt>Attempt</dt>
          <dd>
            {attempt ? (
              <>
                #{attempt.number} <StateBadge state={attempt.state} />
                {attempt.runtime_stopped ? <span className="muted"> · runtime stopped</span> : null}
                {attempt.environment_stopped ? (
                  <span className="muted"> · environment stopped</span>
                ) : null}
              </>
            ) : (
              <span className="muted">None yet</span>
            )}
          </dd>
          <dt>Waiting on you</dt>
          <dd>
            {view.open_attention.length === 0 ? (
              <span className="muted">Nothing</span>
            ) : (
              <Link to="/attention">
                {view.open_attention.length} open attention request
                {view.open_attention.length === 1 ? "" : "s"}
              </Link>
            )}
          </dd>
          <dt>Submitted</dt>
          <dd>{formatTime(record.created_at)}</dd>
        </dl>
      </Section>
      <Results
        tenant={tenant}
        id={id}
        view={view}
        etag={task.data.etag}
        defaults={
          agent
            ? {
                provider_id: agent.provider_id,
                environment_provider_id: agent.environment_provider_id,
              }
            : undefined
        }
        onReviewed={refresh}
      />
      <Section title="Events" actions={<StreamIndicator state={stream} />}>
        {events.length === 0 ? <p className="muted">Waiting for events…</p> : null}
        <ol className="events">
          {events.map((event) => (
            <li key={event.cursor}>
              <time className="muted">{formatTime(event.occurred_at)}</time>{" "}
              <span className="mono">{event.record_kind.replaceAll("_", " ")}</span> {event.event}
              {event.to_state ? (
                <span className="muted">
                  {" "}
                  {event.from_state} → {event.to_state}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

type Disposition = "accept" | "request_changes" | "reject";

const inAnHour = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

// Results lists the proposed revisions. The newest one can be reviewed while
// the task is ready for review: accepted, rejected, or sent back for changes,
// which schedules a new attempt with the providers and budget given here.
function Results({
  tenant,
  id,
  view,
  etag,
  defaults,
  onReviewed,
}: {
  tenant: string;
  id: string;
  view: TaskView;
  etag: string;
  defaults: { provider_id: string; environment_provider_id: string } | undefined;
  onReviewed: () => Promise<void>;
}) {
  const review = useCommandKey();
  const [changing, setChanging] = useState(false);
  const [rework, setRework] = useState({ amount: 100, unit: "tokens" });
  const latest = view.revisions.at(-1);
  const reviewable =
    view.task.state === "ready_for_review" && latest && latest.reviews.length === 0;

  const submit = useMutation({
    mutationFn: async (disposition: Disposition) => {
      if (!latest) throw new Error("No revision to review.");
      const body = {
        revision_id: latest.revision.revision_id,
        disposition,
        ...(disposition === "request_changes" && defaults
          ? {
              rework: {
                ...defaults,
                demand: "person" as const,
                deadline: inAnHour(),
                unit: rework.unit,
                amount: rework.amount,
              },
            }
          : {}),
      };
      return unwrap(
        await surface.POST("/v1/tenants/{tenant}/tasks/{task}/reviews", {
          params: {
            path: { tenant, task: id },
            header: { "Idempotency-Key": review.keyFor(body), "If-Match": etag },
          },
          body,
        }),
      );
    },
    onSuccess: () => {
      review.done();
      setChanging(false);
      return onReviewed();
    },
  });

  return (
    <Section title="Results">
      {view.revisions.length === 0 ? <p className="muted">No result proposed yet.</p> : null}
      <ul className="list">
        {view.revisions.map(({ revision, reviews }) => (
          <li key={revision.revision_id} className="row">
            <div className="row-main">
              <div>
                <strong>Revision {revision.number}</strong>{" "}
                {reviews.map((r) => (
                  <StateBadge key={r.review_id} state={r.disposition} />
                ))}
              </div>
              <p className="muted">Proposed {formatTime(revision.created_at)}</p>
              <p>
                {revision.artifact_ids.length} artifact
                {revision.artifact_ids.length === 1 ? "" : "s"}:{" "}
                {revision.artifact_ids.map((artifact) => (
                  <span key={artifact} className="mono">
                    {shortID(artifact)}{" "}
                  </span>
                ))}
              </p>
              <p className="muted">
                Their content cannot be shown yet: the Surface API does not serve artifacts
                (dac-plane#153).
              </p>
            </div>
          </li>
        ))}
      </ul>
      {reviewable ? (
        <>
          <div className="actions">
            <button
              type="button"
              disabled={submit.isPending}
              onClick={() => submit.mutate("accept")}
            >
              Accept
            </button>
            <button
              type="button"
              className="secondary"
              disabled={submit.isPending || !defaults}
              title={defaults ? undefined : "Rework needs the agent's providers"}
              onClick={() => setChanging(true)}
            >
              Request changes
            </button>
            <button
              type="button"
              className="danger"
              disabled={submit.isPending}
              onClick={() => {
                if (window.confirm("Reject this result? The task ends as rejected."))
                  submit.mutate("reject");
              }}
            >
              Reject
            </button>
          </div>
          {changing ? (
            <form
              className="form"
              onSubmit={(event) => {
                event.preventDefault();
                submit.mutate("request_changes");
              }}
            >
              <div className="grid">
                <label>
                  Budget unit
                  <input
                    required
                    pattern="[a-z][a-z0-9_]{0,31}"
                    value={rework.unit}
                    onChange={(e) => setRework((r) => ({ ...r, unit: e.target.value }))}
                  />
                </label>
                <label>
                  Reserved for the rework
                  <input
                    required
                    type="number"
                    min={1}
                    value={rework.amount}
                    onChange={(e) => setRework((r) => ({ ...r, amount: Number(e.target.value) }))}
                  />
                </label>
              </div>
              <div className="actions">
                <button type="submit" disabled={submit.isPending}>
                  Send back for changes
                </button>
                <button type="button" className="secondary" onClick={() => setChanging(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </>
      ) : null}
      <ProblemNotice error={submit.error} />
    </Section>
  );
}

export function TaskPage() {
  const { taskID } = useParams();
  const config = useConfig();
  if (config.error) return <ProblemNotice error={config.error} />;
  if (!config.data || !taskID) return <p className="muted">Loading…</p>;
  return <TaskDetail tenant={config.data.tenant} id={taskID} />;
}
