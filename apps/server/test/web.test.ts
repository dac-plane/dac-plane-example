import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";

const tenant = "01a167fd-51d9-76ba-b563-496e2bd89646";

let app: FastifyInstance;

beforeAll(async () => {
  const root = mkdtempSync(join(tmpdir(), "web-test-"));
  mkdirSync(join(root, "assets"));
  writeFileSync(join(root, "index.html"), "<!doctype html><div id=root></div>");
  writeFileSync(join(root, "assets", "index-abc123.js"), "console.log(1)");
  writeFileSync(join(root, ".secret"), "nope");
  app = await buildApp({
    surfaceURL: new URL("http://127.0.0.1:9"),
    tenant,
    tokens: { token: async () => "t" },
    fetch: async () => new Response(null, { status: 599 }),
    webRoot: root,
    allowedHosts: ["localhost:80"],
  });
});

afterAll(() => app.close());

describe("the built web app", () => {
  it("serves index.html at the root and for client-side routes, never cached", async () => {
    for (const url of ["/", "/agents", "/tasks/01a167fd-51d9-7000-8000-000000000001?x=1"]) {
      const response = await app.inject({ method: "GET", url });
      expect(response.statusCode, url).toBe(200);
      expect(response.body).toContain("id=root");
      expect(response.headers["cache-control"]).toBe("no-cache");
      expect(response.headers["content-security-policy"]).toContain("default-src 'self'");
      expect(response.headers["x-content-type-options"]).toBe("nosniff");
    }
  });

  it("caches fingerprinted assets for good", async () => {
    const response = await app.inject({ method: "GET", url: "/assets/index-abc123.js" });
    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
  });

  it("answers 404 for a missing asset, an unknown API path and a non-GET", async () => {
    for (const [method, url] of [
      ["GET", "/assets/missing.js"],
      ["GET", "/api/unknown"],
      ["DELETE", "/agents"],
    ] as const) {
      const response = await app.inject({ method, url });
      expect(response.statusCode, `${method} ${url}`).toBe(404);
      expect(response.headers["content-type"]).toContain("application/problem+json");
    }
  });

  it("does not serve dotfiles", async () => {
    const response = await app.inject({ method: "GET", url: "/.secret" });
    expect(response.statusCode).not.toBe(200);
    expect(response.body).not.toContain("nope");
  });

  it("keeps the health check's own answer", async () => {
    const response = await app.inject({ method: "GET", url: "/healthz" });
    expect(response.json()).toEqual({ status: "ok" });
  });
});
