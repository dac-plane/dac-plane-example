import { createServer, type IncomingMessage, request, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import type { FastifyInstance } from "fastify";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";
import type { TokenSource } from "../src/token.ts";

const tenant = "01a167fd-51d9-76ba-b563-496e2bd89646";

interface Seen {
  method: string;
  url: string;
  headers: IncomingMessage["headers"];
  body: string;
}

// A stand-in for dac-plane over plain HTTP: it records each request and
// answers with whatever the test puts in `respond`.
let upstream: Server;
let upstreamURL: URL;
let seen: Seen[] = [];
let respond: (req: IncomingMessage, res: import("node:http").ServerResponse) => void;
let streamClosed: Promise<void>;
let markStreamClosed: () => void;

beforeAll(async () => {
  upstream = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      seen.push({ method: req.method ?? "", url: req.url ?? "", headers: req.headers, body });
      respond(req, res);
    });
  });
  await new Promise<void>((resolve) => upstream.listen(0, "127.0.0.1", resolve));
  const { port } = upstream.address() as AddressInfo;
  upstreamURL = new URL(`http://127.0.0.1:${port}`);
});

afterAll(async () => {
  upstream.closeAllConnections();
  await new Promise((resolve) => upstream.close(resolve));
});

const tokens = (token = "token-1"): TokenSource => ({ token: async () => token });

async function app(source: TokenSource = tokens()): Promise<FastifyInstance> {
  return buildApp({ surfaceURL: upstreamURL, tenant, tokens: source, fetch });
}

let current: FastifyInstance | undefined;
afterEach(async () => {
  await current?.close();
  current = undefined;
  seen = [];
});

describe("proxy", () => {
  it("adds the token and forwards command headers and the exact body", async () => {
    respond = (_req, res) => {
      res.writeHead(201, {
        "content-type": "application/json",
        etag: '"7"',
        location: `/v1/tenants/${tenant}/tasks/t1`,
        "x-internal": "not for the browser",
      });
      res.end('{"task":{"task_id":"t1"}}');
    };
    current = await app();
    const body = '{"objective":"Review the repository" ,"acceptance_criteria":["a"]}';
    const response = await current.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenant}/tasks?x=1`,
      headers: {
        "content-type": "application/json",
        "idempotency-key": "key-1",
        "if-match": '"6"',
        authorization: "Bearer from-the-browser",
        cookie: "session=abc",
      },
      payload: body,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({ task: { task_id: "t1" } });
    expect(response.headers.etag).toBe('"7"');
    expect(response.headers.location).toBe(`/api/v1/tenants/${tenant}/tasks/t1`);
    expect(response.headers["x-internal"]).toBeUndefined();

    expect(seen).toHaveLength(1);
    const [request] = seen as [Seen];
    expect(request.method).toBe("POST");
    expect(request.url).toBe(`/v1/tenants/${tenant}/tasks?x=1`);
    expect(request.body).toBe(body);
    expect(request.headers.authorization).toBe("Bearer token-1");
    expect(request.headers["idempotency-key"]).toBe("key-1");
    expect(request.headers["if-match"]).toBe('"6"');
    expect(request.headers.cookie).toBeUndefined();
  });

  it.each(["cross-site", "same-site"])("refuses a %s browser request", async (site) => {
    current = await app();
    const response = await current.inject({
      method: "POST",
      url: `/api/v1/tenants/${tenant}/tasks`,
      headers: { "sec-fetch-site": site, "content-type": "text/plain" },
      payload: "{}",
    });
    expect(response.statusCode).toBe(403);
    expect(response.headers["content-type"]).toContain("application/problem+json");
    expect(seen).toHaveLength(0);
  });

  it("passes a same-origin browser request", async () => {
    respond = (_req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end("{}");
    };
    current = await app();
    const response = await current.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenant}/attention`,
      headers: { "sec-fetch-site": "same-origin" },
    });
    expect(response.statusCode).toBe(200);
    expect(seen).toHaveLength(1);
  });

  it("passes a problem document through unchanged", async () => {
    const problem = { type: "https://dac-plane.dev/problems/stale", title: "Stale", status: 412 };
    respond = (_req, res) => {
      res.writeHead(412, { "content-type": "application/problem+json" });
      res.end(JSON.stringify(problem));
    };
    current = await app();
    const response = await current.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenant}/attention`,
    });
    expect(response.statusCode).toBe(412);
    expect(response.headers["content-type"]).toBe("application/problem+json");
    expect(response.json()).toEqual(problem);
  });

  it.each([
    ["another tenant", "/api/v1/tenants/01a167fd-51d9-76ba-b563-000000000000/tasks"],
    ["a path outside the tenant", "/api/v1/operations/health"],
    ["a climbing segment", `/api/v1/tenants/${tenant}/..%2f..%2fadmin`],
  ])("refuses %s without calling dac-plane", async (_name, url) => {
    respond = (_req, res) => res.end();
    current = await app();
    const response = await current.inject({ method: "GET", url });
    expect(response.statusCode).toBe(404);
    expect(response.headers["content-type"]).toContain("application/problem+json");
    expect(seen).toHaveLength(0);
  });

  // inject() normalizes dot segments before routing, so these go over a real
  // socket, where the path arrives exactly as sent.
  it.each([`/api/v1/tenants/${tenant}/./tasks`, `/api/v1/tenants/${tenant}/../../operations`])(
    "refuses the raw path %s without calling dac-plane",
    async (path) => {
      respond = (_req, res) => res.end();
      current = await app();
      await current.listen({ host: "127.0.0.1", port: 0 });
      const { port } = current.server.address() as AddressInfo;
      const status = await new Promise<number | undefined>((resolve, reject) => {
        request({ host: "127.0.0.1", port, path, method: "GET" }, (res) => {
          res.resume();
          resolve(res.statusCode);
        })
          .on("error", reject)
          .end();
      });
      expect(status).toBe(404);
      expect(seen).toHaveLength(0);
    },
  );

  it("reports a missing token as 502 without calling dac-plane", async () => {
    respond = (_req, res) => res.end();
    current = await app({
      token: async () => {
        throw new Error("issuer down");
      },
    });
    const response = await current.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenant}/agents`,
    });
    expect(response.statusCode).toBe(502);
    expect(response.json()).toMatchObject({ status: 502, title: "Bad Gateway" });
    expect(seen).toHaveLength(0);
  });

  it("reports an unreachable dac-plane as 502", async () => {
    current = await buildApp({
      surfaceURL: new URL("http://127.0.0.1:9"),
      tenant,
      tokens: tokens(),
      fetch,
    });
    const response = await current.inject({
      method: "GET",
      url: `/api/v1/tenants/${tenant}/agents`,
    });
    expect(response.statusCode).toBe(502);
    expect(response.json()).toMatchObject({ detail: "dac-plane could not be reached." });
  });

  it("relays an event stream as it arrives and closes it when the browser leaves", async () => {
    streamClosed = new Promise((resolve) => {
      markStreamClosed = resolve;
    });
    respond = (req, res) => {
      res.writeHead(200, { "content-type": "text/event-stream" });
      res.write(`id: c1\nevent: task\ndata: {"n":1}\n\n`);
      res.on("close", () => markStreamClosed());
      expect(req.headers["last-event-id"]).toBe("c0");
    };
    current = await app();
    await current.listen({ host: "127.0.0.1", port: 0 });
    const { port } = current.server.address() as AddressInfo;

    const browser = new AbortController();
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/tenants/${tenant}/events`, {
      headers: { accept: "text/event-stream", "last-event-id": "c0" },
      signal: browser.signal,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/event-stream");

    const reader = (response.body as ReadableStream<Uint8Array>).getReader();
    const first = await reader.read();
    expect(new TextDecoder().decode(first.value)).toBe(`id: c1\nevent: task\ndata: {"n":1}\n\n`);

    browser.abort();
    await expect(streamClosed).resolves.toBeUndefined();
  });
});

describe("readiness", () => {
  it("answers liveness without calling dac-plane", async () => {
    current = await app();
    const response = await current.inject({ method: "GET", url: "/healthz" });
    expect(response.json()).toEqual({ status: "ok" });
    expect(seen).toHaveLength(0);
  });

  it("is ready when dac-plane answers for the tenant", async () => {
    respond = (_req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end('{"agents":[]}');
    };
    current = await app();
    const response = await current.inject({ method: "GET", url: "/readyz" });
    expect(response.statusCode).toBe(200);
    expect(seen[0]?.url).toBe(`/v1/tenants/${tenant}/agents`);
    expect(seen[0]?.headers.authorization).toBe("Bearer token-1");
  });

  it("is not ready when dac-plane refuses the token", async () => {
    respond = (_req, res) => {
      res.writeHead(401, { "content-type": "application/problem+json" });
      res.end('{"type":"about:blank","title":"Unauthorized","status":401}');
    };
    current = await app();
    const response = await current.inject({ method: "GET", url: "/readyz" });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({ status: "not-ready", dac_plane: 401 });
  });
});
