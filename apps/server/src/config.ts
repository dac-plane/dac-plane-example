import { readFileSync } from "node:fs";

/** Where one origin is dialled instead, like curl's --connect-to. */
export interface ConnectTarget {
  host: string;
  port: number;
}

export interface Config {
  host: string;
  port: number;
  /** The Surface API origin, such as `https://dac-plane:8443`. */
  surfaceURL: URL;
  /** The one tenant this application works in. */
  tenant: string;
  /** The issuer's token endpoint, for the client credentials grant. */
  tokenURL: URL;
  clientID: string;
  clientSecret: string;
  scope: string;
  /** A PEM bundle trusted for the Surface API and the issuer, when they use a private CA. */
  ca?: string;
  /** `host:port` of an origin mapped to the address actually dialled. */
  connectTo: Map<string, ConnectTarget>;
  /**
   * Providers a new agent defaults to. The Surface API cannot list providers
   * (dac-plane#156), so the operator names the ones provisioned for the tenant.
   */
  defaults: { runtimeProviderID?: string; environmentProviderID?: string };
}

type Env = Record<string, string | undefined>;

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function required(env: Env, name: string): string {
  const value = env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function httpsURL(env: Env, name: string): URL {
  const raw = required(env, name);
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${name} is not a URL`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`${name} must be an https URL`);
  }
  return url;
}

function port(raw: string, name: string): number {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`${name} has an invalid port: ${raw}`);
  }
  return value;
}

// parseConnectTo reads `issuer:8443=127.0.0.1:18080,dac-plane:8443=127.0.0.1:18443`.
export function parseConnectTo(raw: string | undefined): Map<string, ConnectTarget> {
  const map = new Map<string, ConnectTarget>();
  for (const entry of (raw ?? "").split(",").map((e) => e.trim())) {
    if (!entry) continue;
    const match = /^([^:=\s]+):(\d+)=([^:=\s]+):(\d+)$/.exec(entry);
    if (!match) {
      throw new Error(`DAC_CONNECT_TO entry is not host:port=address:port: ${entry}`);
    }
    const [, host, hostPort, address, addressPort] = match as unknown as [
      string,
      string,
      string,
      string,
      string,
    ];
    map.set(`${host.toLowerCase()}:${port(hostPort, "DAC_CONNECT_TO")}`, {
      host: address,
      port: port(addressPort, "DAC_CONNECT_TO"),
    });
  }
  return map;
}

function optionalUUID(env: Env, name: string): string | undefined {
  const value = env[name]?.trim();
  if (!value) return undefined;
  if (!uuid.test(value)) {
    throw new Error(`${name} must be a UUID`);
  }
  return value;
}

// readSecret reads a secret from a file, so it never sits in the environment
// or a process listing.
function readSecret(env: Env, name: string): string {
  const path = required(env, name);
  const value = readFileSync(path, "utf8").trim();
  if (!value) {
    throw new Error(`${name} names an empty file`);
  }
  return value;
}

const withValue = <K extends string>(key: K, value: string | undefined) =>
  value === undefined ? {} : ({ [key]: value } as Record<K, string>);

export function loadConfig(env: Env = process.env): Config {
  const tenant = required(env, "DAC_TENANT");
  if (!uuid.test(tenant)) {
    throw new Error("DAC_TENANT must be a UUID");
  }
  const caFile = env.DAC_CA_FILE?.trim();
  return {
    host: env.HOST?.trim() || "127.0.0.1",
    port: port(env.PORT?.trim() || "3000", "PORT"),
    surfaceURL: httpsURL(env, "DAC_SURFACE_URL"),
    tenant,
    tokenURL: httpsURL(env, "DAC_TOKEN_URL"),
    clientID: required(env, "DAC_CLIENT_ID"),
    clientSecret: readSecret(env, "DAC_CLIENT_SECRET_FILE"),
    scope: env.DAC_SCOPE?.trim() || "dac-plane-surface",
    ...(caFile ? { ca: readFileSync(caFile, "utf8") } : {}),
    connectTo: parseConnectTo(env.DAC_CONNECT_TO),
    defaults: {
      ...withValue("runtimeProviderID", optionalUUID(env, "DAC_RUNTIME_PROVIDER_ID")),
      ...withValue("environmentProviderID", optionalUUID(env, "DAC_ENVIRONMENT_PROVIDER_ID")),
    },
  };
}
