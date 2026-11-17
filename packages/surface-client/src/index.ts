import createClient, { type Client, type Middleware } from "openapi-fetch";
import type { components, paths } from "./schema.gen.ts";

export type { components, paths };
export type Schemas = components["schemas"];

/** An RFC 9457 problem document, as dac-plane returns for every error. */
export type Problem = Schemas["problem.schema"];

export interface SurfaceClientOptions {
  /** The Surface API origin, such as `https://dac-plane:8443`. Paths start with `/v1`. */
  baseUrl: string;
  /**
   * Returns a current access token; called for every request so expired tokens are replaced.
   * Omitted in the browser, whose requests go through the application's server, which adds it.
   */
  accessToken?: () => Promise<string>;
  /** A fetch implementation, for tests or a custom TLS agent. */
  fetch?: (request: Request) => Promise<Response>;
}

export type SurfaceClient = Client<paths>;

/** A typed client for the dac-plane Surface API v1, generated from the released contract. */
export function createSurfaceClient(options: SurfaceClientOptions): SurfaceClient {
  const client = createClient<paths>({
    baseUrl: options.baseUrl,
    ...(options.fetch ? { fetch: options.fetch } : {}),
  });
  const { accessToken } = options;
  if (accessToken) {
    const authenticate: Middleware = {
      async onRequest({ request }) {
        request.headers.set("Authorization", `Bearer ${await accessToken()}`);
        return request;
      },
    };
    client.use(authenticate);
  }
  return client;
}
