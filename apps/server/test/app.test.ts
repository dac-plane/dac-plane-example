import { afterAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";

describe("server", () => {
  const app = buildApp();
  afterAll(async () => {
    await app.close();
  });

  it("answers its health check", async () => {
    const response = await app.inject({ method: "GET", url: "/healthz" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
