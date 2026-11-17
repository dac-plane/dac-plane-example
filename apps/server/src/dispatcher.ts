import { Agent, buildConnector, type Dispatcher } from "undici";
import type { ConnectTarget } from "./config.ts";

export interface DispatcherOptions {
  ca?: string;
  connectTo?: Map<string, ConnectTarget>;
}

// createDispatcher is the HTTP agent for dac-plane and its issuer. It trusts
// the deployment's CA when one is given, and dials a mapped address for an
// origin while still verifying the certificate against the origin's name,
// which a local stack published on other ports needs.
export function createDispatcher(options: DispatcherOptions = {}): Dispatcher {
  const connect = buildConnector(options.ca ? { ca: options.ca } : {});
  const connectTo = options.connectTo ?? new Map<string, ConnectTarget>();
  return new Agent({
    // The event stream stays open with long silences; a closed browser
    // request aborts it instead.
    bodyTimeout: 0,
    headersTimeout: 30_000,
    connect(opts, callback) {
      const defaultPort = opts.protocol === "https:" ? 443 : 80;
      const key = `${opts.hostname.toLowerCase()}:${opts.port || defaultPort}`;
      const target = connectTo.get(key);
      if (!target) {
        return connect(opts, callback);
      }
      return connect(
        { ...opts, hostname: target.host, port: String(target.port), servername: opts.hostname },
        callback,
      );
    },
  });
}
