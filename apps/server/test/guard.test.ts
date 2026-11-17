import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";

const tenant = "01a167fd-51d9-76ba-b563-496e2bd89646";
const host = "127.0.0.1:3000";
const config = "/api/config";
const tasks = `/api/v1/tenants/${tenant}/tasks`;

let app: FastifyInstance;
let upstreamCalls = 0;

beforeAll(async () => {
  app = await buildApp({
    surfaceURL: new URL("http://127.0.0.1:9"),
    tenant,
    tokens: { token: async () => "t" },
    fetch: async () => {
      upstreamCalls++;
      return Response.json({}, { status: 201 });
    },
    allowedHosts: [host, "localhost:3000"],
  });
});

afterAll(() => app.close());

async function call(method: "GET" | "POST", url: string, headers: Record<string, string>) {
  const before = upstreamCalls;
  const response = await app.inject({
    method,
    url,
    headers: { host, ...headers },
    ...(method === "POST" ? { payload: "{}" } : {}),
  });
  return { response, relayed: upstreamCalls > before };
}

describe("the /api guard", () => {
  it("answers this application's own pages", async () => {
    const read = await call("GET", config, { "sec-fetch-site": "same-origin" });
    expect(read.response.statusCode).toBe(200);
    const write = await call("POST", tasks, {
      "sec-fetch-site": "same-origin",
      origin: `http://${host}`,
      "content-type": "application/json",
    });
    expect(write.response.statusCode).toBe(201);
    expect(write.relayed).toBe(true);
  });

  it("refuses a Host it does not serve, as a rebound DNS name would send", async () => {
    for (const headers of [
      { host: "attacker.example:3000", "sec-fetch-site": "same-origin" },
      { host: "127.0.0.1:4000", "sec-fetch-site": "same-origin" },
    ]) {
      const { response, relayed } = await call("POST", tasks, headers);
      expect(response.statusCode, headers.host).toBe(403);
      expect(relayed).toBe(false);
    }
    const { response } = await call("GET", config, { host: "attacker.example:3000" });
    expect(response.statusCode).toBe(403);
  });

  it("guards the route the router matched, however its path is encoded", async () => {
    // The router decodes %61 to "a", so this reaches /api/config.
    for (const url of ["/%61pi/config", `/%61pi/v1/tenants/${tenant}/tasks`]) {
      const { response, relayed } = await call("GET", url, { host: "attacker.example:3000" });
      expect(response.statusCode, url).toBe(403);
      expect(relayed).toBe(false);
    }
  });

  it.each(["cross-site", "same-site"])("refuses a %s browser request", async (site) => {
    const { response, relayed } = await call("POST", tasks, {
      "sec-fetch-site": site,
      "content-type": "text/plain",
    });
    expect(response.statusCode).toBe(403);
    expect(response.headers["content-type"]).toContain("application/problem+json");
    expect(relayed).toBe(false);
  });

  describe("without Fetch Metadata", () => {
    it("accepts a write from its own origin", async () => {
      const { response, relayed } = await call("POST", tasks, { origin: `http://${host}` });
      expect(response.statusCode).toBe(201);
      expect(relayed).toBe(true);
    });

    it("refuses a write from another origin", async () => {
      for (const origin of ["https://attacker.example", "http://127.0.0.1:4000", "null"]) {
        const { response, relayed } = await call("POST", tasks, { origin });
        expect(response.statusCode, origin).toBe(403);
        expect(relayed).toBe(false);
      }
    });

    it("refuses a write that names no origin", async () => {
      const { response, relayed } = await call("POST", tasks, {});
      expect(response.statusCode).toBe(403);
      expect(relayed).toBe(false);
    });

    it("answers a read that names no origin, such as curl's", async () => {
      const { response } = await call("GET", config, {});
      expect(response.statusCode).toBe(200);
    });
  });

  it("leaves the health checks and the web app alone", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/healthz",
      headers: { host: "attacker.example:3000" },
    });
    expect(response.statusCode).toBe(200);
  });
});
