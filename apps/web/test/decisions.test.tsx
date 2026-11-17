import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App.tsx";
import { answerDigest, changesAttention } from "../src/pages/Attention.tsx";
import { agent, config, renderAt, tenant } from "./render.tsx";
import { api } from "./setup.ts";

const json = (body: unknown, init: ResponseInit = {}) => Response.json(body, init);
const task = "01a1e8b0-4068-7981-8fe2-396bf00583a5";
const attention = "01a1e8b0-6a9e-7df0-a339-a6fef6ea28fa";

function request(kind: string, extra: Record<string, unknown> = {}) {
  return {
    attention_id: attention,
    tenant_id: tenant,
    task_id: task,
    attempt_id: "01a1e8b0-4068-7981-8fe2-000000000001",
    kind,
    policy_generation: 1,
    responders: [agent().created_by],
    state: "pending",
    version: 3,
    expires_at: "2026-11-17T12:00:00Z",
    created_at: "2026-11-17T10:00:00Z",
    updated_at: "2026-11-17T10:00:00Z",
    ...extra,
  };
}

beforeEach(() => {
  api.requests = [];
});

const decisions = () =>
  api.requests.filter(
    (r) => r.method === "POST" && r.url.endsWith(`/attention/${attention}/decisions`),
  );

describe("attention", () => {
  it("answers a question with the digest of the answer, on the version shown", async () => {
    api.handle = (r) => {
      const path = new URL(r.url).pathname;
      if (path === "/api/config") return json(config);
      if (path === `/api/v1/tenants/${tenant}/attention`)
        return json({ attention: [request("question")] });
      if (path.endsWith("/decisions")) {
        return json({
          attention_id: attention,
          decision_id: attention,
          kind: "answer",
          state: "decided",
        });
      }
      return new Response(null, { status: 404 });
    };
    renderAt("/attention", <App />);
    fireEvent.change(await screen.findByLabelText("Answer"), {
      target: { value: "Yes, go ahead." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send answer" }));

    await waitFor(() => expect(decisions()).toHaveLength(1));
    const [sent] = decisions() as [Request];
    expect(sent.headers.get("if-match")).toBe('"3"');
    expect(sent.headers.get("idempotency-key")).toBeTruthy();
    expect(await sent.json()).toEqual({
      kind: "answer",
      // printf 'Yes, go ahead.' | shasum -a 256
      answer_digest: "sha256:fb11cab17926b4f757b9fc6080b83d7eddf066312bc0c4792b62c31e01ab829e",
    });
  });

  it("shows a connector proposal and approves it once", async () => {
    api.handle = (r) => {
      const path = new URL(r.url).pathname;
      if (path === "/api/config") return json(config);
      if (path === `/api/v1/tenants/${tenant}/attention`) {
        return json({
          attention: [
            request("action_approval", {
              provider_id: config.defaults.runtime_provider_id,
              operation_id: "01a1e8b0-0000-7000-8000-000000000002",
              action_digest: `sha256:${"a".repeat(64)}`,
            }),
          ],
        });
      }
      if (path.endsWith("/connector-call")) {
        return json({
          attention_id: attention,
          operation_id: "01a1e8b0-0000-7000-8000-000000000002",
          connection_id: "01a1e8b0-0000-7000-8000-000000000003",
          attention_version: 3,
          tool: "get_issue",
          input: { number: 42 },
          input_digest: `sha256:${"b".repeat(64)}`,
        });
      }
      if (path.endsWith("/decisions")) {
        return json({
          attention_id: attention,
          decision_id: attention,
          kind: "approve_once",
          state: "decided",
        });
      }
      return new Response(null, { status: 404 });
    };
    renderAt("/attention", <App />);
    expect(await screen.findByText("get_issue")).toBeDefined();
    expect(screen.getByText(/"number": 42/)).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Approve once" }));
    await waitFor(() => expect(decisions()).toHaveLength(1));
    expect(await (decisions()[0] as Request).json()).toEqual({ kind: "approve_once" });
    expect(await screen.findByText(/Decided: approve once/)).toBeDefined();
  });
});

describe("answerDigest", () => {
  it("is the SHA-256 of the UTF-8 bytes, as dac-plane's guide computes it", async () => {
    expect(await answerDigest("abc")).toBe(
      "sha256:ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});

describe("review", () => {
  it("accepts the newest revision with the task's ETag", async () => {
    const revision = "01a1e8b0-85da-7395-b82b-71e02c9d4803";
    let reviewed = false;
    api.handle = (r) => {
      const path = new URL(r.url).pathname;
      if (path === "/api/config") return json(config);
      if (path === `/api/v1/tenants/${tenant}/agents`) return json({ agents: [agent()] });
      if (path === `/api/v1/tenants/${tenant}/tasks/${task}/reviews`) {
        reviewed = true;
        return json({ review: { review_id: revision, disposition: "accept" } }, { status: 201 });
      }
      if (path === `/api/v1/tenants/${tenant}/tasks/${task}`) {
        return json(
          {
            task: {
              task_id: task,
              tenant_id: tenant,
              owner_id: agent().created_by,
              objective: "Review the repository",
              acceptance_criteria: ["The review is attached"],
              agent: { agent_id: agent().agent_id, revision: 1 },
              state: reviewed ? "succeeded" : "ready_for_review",
              version: 7,
              created_at: "2026-11-17T10:00:00Z",
              updated_at: "2026-11-17T10:00:01Z",
            },
            open_attention: [],
            revisions: [
              {
                revision: {
                  revision_id: revision,
                  tenant_id: tenant,
                  task_id: task,
                  attempt_id: "01a1e8b0-4068-7981-8fe2-000000000001",
                  number: 1,
                  artifact_ids: ["01a1e8b0-7a8d-7414-84bd-fb72ccd30e22"],
                  verification_ids: ["01a1e8b0-7a8d-7414-84bd-fb72ccd30e23"],
                  created_at: "2026-11-17T10:05:00Z",
                },
                reviews: reviewed ? [{ review_id: revision, disposition: "accept" }] : [],
              },
            ],
          },
          { headers: { etag: '"7"' } },
        );
      }
      return new Response(null, { status: 404 });
    };
    renderAt(`/tasks/${task}`, <App />);
    fireEvent.click(await screen.findByRole("button", { name: "Accept" }));
    await waitFor(() => expect(reviewed).toBe(true));
    const sent = api.requests.find((r) => r.url.endsWith("/reviews")) as Request;
    expect(sent.headers.get("if-match")).toBe('"7"');
    expect(await sent.json()).toEqual({ revision_id: revision, disposition: "accept" });
    expect(await screen.findByText("succeeded")).toBeDefined();
  });
});

describe("changesAttention", () => {
  const event = (record_kind: string, to_state: string) =>
    ({ record_kind, to_state }) as Parameters<typeof changesAttention>[0];

  it("refreshes on an attention request's change and on work that starts waiting", () => {
    expect(changesAttention(event("attention_request", "decided"))).toBe(true);
    // dac-plane announces a new request only through this move.
    expect(changesAttention(event("attempt", "waiting_input"))).toBe(true);
    expect(changesAttention(event("task", "waiting_input"))).toBe(true);
  });

  it("ignores events that cannot change what is waiting", () => {
    expect(changesAttention(event("budget", "open"))).toBe(false);
    expect(changesAttention(event("attempt", "executing"))).toBe(false);
  });
});
