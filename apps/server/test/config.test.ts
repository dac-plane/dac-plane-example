import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadConfig, parseConnectTo } from "../src/config.ts";

const dir = mkdtempSync(join(tmpdir(), "config-test-"));
const secretFile = join(dir, "secret");
writeFileSync(secretFile, "s3cret\n");

const env = {
  DAC_SURFACE_URL: "https://dac-plane:8443",
  DAC_TENANT: "01a167fd-51d9-76ba-b563-496e2bd89646",
  DAC_TOKEN_URL: "https://issuer:8443/default/token",
  DAC_CLIENT_ID: "surface-owner",
  DAC_CLIENT_SECRET_FILE: secretFile,
};

describe("loadConfig", () => {
  it("reads the configuration and the secret from its file", () => {
    const config = loadConfig(env);
    expect(config.surfaceURL.href).toBe("https://dac-plane:8443/");
    expect(config.clientSecret).toBe("s3cret");
    expect(config.scope).toBe("dac-plane-surface");
    expect(config.port).toBe(3000);
    expect(config.host).toBe("127.0.0.1");
    expect(config.allowedHosts).toEqual(["127.0.0.1:3000", "localhost:3000"]);
  });

  it("follows PORT for the default hosts and reads ALLOWED_HOSTS", () => {
    expect(loadConfig({ ...env, PORT: "4000" }).allowedHosts).toEqual([
      "127.0.0.1:4000",
      "localhost:4000",
    ]);
    expect(
      loadConfig({ ...env, ALLOWED_HOSTS: " Example.test:8080 ,localhost:5173" }).allowedHosts,
    ).toEqual(["example.test:8080", "localhost:5173"]);
  });

  it.each([
    ["a missing tenant", { DAC_TENANT: "" }, "DAC_TENANT is required"],
    ["a tenant that is not a UUID", { DAC_TENANT: "acme" }, "DAC_TENANT must be a UUID"],
    [
      "a plain-HTTP Surface API",
      { DAC_SURFACE_URL: "http://dac-plane:8443" },
      "must be an https URL",
    ],
    ["a missing secret file", { DAC_CLIENT_SECRET_FILE: join(dir, "absent") }, "ENOENT"],
    ["a relative web root", { WEB_ROOT: "apps/web/dist" }, "WEB_ROOT must be an absolute path"],
    ["an allowed host without a port", { ALLOWED_HOSTS: "localhost" }, "is not host:port"],
    [
      "an allowed host with a scheme",
      { ALLOWED_HOSTS: "http://localhost:3000" },
      "is not host:port",
    ],
  ])("refuses %s", (_name, override, message) => {
    expect(() => loadConfig({ ...env, ...override })).toThrow(message);
  });
});

describe("parseConnectTo", () => {
  it("maps origins to the addresses dialled", () => {
    const map = parseConnectTo("issuer:8443=127.0.0.1:18080, dac-plane:8443=127.0.0.1:18443");
    expect(map.get("issuer:8443")).toEqual({ host: "127.0.0.1", port: 18080 });
    expect(map.get("dac-plane:8443")).toEqual({ host: "127.0.0.1", port: 18443 });
  });

  it("refuses a malformed entry", () => {
    expect(() => parseConnectTo("dac-plane=127.0.0.1")).toThrow("host:port=address:port");
  });
});
