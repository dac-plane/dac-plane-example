import { act, fireEvent, renderHook, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App.tsx";
import { useCommandKey } from "../src/components.tsx";
import { agent, config, renderAt, tenant } from "./render.tsx";
import { api } from "./setup.ts";

const json = (body: unknown, init: ResponseInit = {}) => Response.json(body, init);

beforeEach(() => {
  api.requests = [];
});

describe("agents", () => {
  it("lists active agents", async () => {
    api.handle = (request) => {
      const path = new URL(request.url).pathname;
      if (path === "/api/config") return json(config);
      if (path === `/api/v1/tenants/${tenant}/agents`) return json({ agents: [agent()] });
      return new Response(null, { status: 404 });
    };
    renderAt("/agents", <App />);
    expect(await screen.findByText("reviewer")).toBeDefined();
    expect(screen.getByText("Reviews repositories")).toBeDefined();
  });

  it("shows dac-plane's problem when it refuses a new agent, and keeps the key for a retry", async () => {
    api.handle = (request) => {
      const path = new URL(request.url).pathname;
      if (path === "/api/config") return json(config);
      if (path === `/api/v1/tenants/${tenant}/agents` && request.method === "GET")
        return json({ agents: [] });
      return json(
        {
          type: "https://dac-plane.dev/problems/conflict",
          title: "Conflict",
          status: 409,
          detail: "Another active agent already has the name.",
        },
        { status: 409, headers: { "content-type": "application/problem+json" } },
      );
    };
    renderAt("/agents", <App />);
    fireEvent.click(await screen.findByRole("button", { name: "New agent" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "reviewer" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Reviews repositories" } });
    fireEvent.click(screen.getByRole("button", { name: "Create agent" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("409 Conflict");
    expect(alert.textContent).toContain("Another active agent already has the name.");

    fireEvent.click(screen.getByRole("button", { name: "Create agent" }));
    await waitFor(() => expect(api.requests.filter((r) => r.method === "POST")).toHaveLength(2));
    const [first, second] = api.requests.filter((r) => r.method === "POST") as [Request, Request];
    expect(first.headers.get("idempotency-key")).toBeTruthy();
    expect(second.headers.get("idempotency-key")).toBe(first.headers.get("idempotency-key"));
    expect(await first.json()).toEqual({
      name: "reviewer",
      role: "Reviews repositories",
      provider_id: config.defaults.runtime_provider_id,
      environment_provider_id: config.defaults.environment_provider_id,
    });
  });
});

describe("tasks", () => {
  it("delegates a task to the chosen agent and opens it", async () => {
    const task = "01a1e8b0-4068-7981-8fe2-396bf00583a5";
    api.handle = (request) => {
      const path = new URL(request.url).pathname;
      if (path === "/api/config") return json(config);
      if (path === `/api/v1/tenants/${tenant}/agents`) return json({ agents: [agent()] });
      if (path === `/api/v1/tenants/${tenant}/tasks` && request.method === "POST") {
        return json({ task: { task_id: task } }, { status: 201 });
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
              state: "running",
              version: 2,
              created_at: "2026-11-17T10:00:00Z",
              updated_at: "2026-11-17T10:00:01Z",
            },
            open_attention: [],
            revisions: [],
          },
          { headers: { etag: '"2"' } },
        );
      }
      return new Response(null, { status: 404 });
    };
    renderAt("/", <App />);
    fireEvent.click(await screen.findByRole("button", { name: "New task" }));
    await screen.findByRole("option", { name: "reviewer: Reviews repositories" });
    fireEvent.change(screen.getByLabelText("Objective"), {
      target: { value: "Review the repository" },
    });
    fireEvent.change(screen.getByLabelText(/Acceptance criteria/), {
      target: { value: "The review is attached\n\n" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Delegate task" }));

    expect(await screen.findByRole("heading", { name: "Review the repository" })).toBeDefined();
    const submitted = api.requests.find((r) => r.method === "POST") as Request;
    const body = await submitted.json();
    expect(body).toMatchObject({
      agent_id: agent().agent_id,
      objective: "Review the repository",
      acceptance_criteria: ["The review is attached"],
      demand: "person",
      unit: "tokens",
      ceiling: 1000,
      amount: 100,
    });
    expect(screen.getByText("running")).toBeDefined();
  });
});

describe("useCommandKey", () => {
  it("keeps a key for the same body, changes it for another, and releases it when done", () => {
    const { result } = renderHook(() => useCommandKey());
    const first = result.current.keyFor({ a: 1 });
    expect(result.current.keyFor({ a: 1 })).toBe(first);
    const second = result.current.keyFor({ a: 2 });
    expect(second).not.toBe(first);
    act(() => result.current.done());
    expect(result.current.keyFor({ a: 2 })).not.toBe(second);
  });
});
