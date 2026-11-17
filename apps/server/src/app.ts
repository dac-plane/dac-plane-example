import { createSurfaceClient } from "@dac-plane-example/surface-client";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import { registerProxy } from "./proxy.ts";
import type { Fetch, TokenSource } from "./token.ts";
import { registerWeb } from "./web.ts";

export interface AppOptions {
  surfaceURL: URL;
  tenant: string;
  tokens: TokenSource;
  fetch: Fetch;
  defaults?: { runtimeProviderID?: string; environmentProviderID?: string };
  /** The built web app, served beside the API when set. */
  webRoot?: string;
  server?: FastifyServerOptions;
}

// buildApp assembles the server without starting it, so tests can drive it
// with inject() and main.ts owns the listening socket and the signals.
export async function buildApp(options: AppOptions): Promise<FastifyInstance> {
  const app = Fastify(options.server ?? {});

  // Liveness: the process answers.
  app.get("/healthz", async () => ({ status: "ok" }));

  // Readiness: a token is issued and dac-plane answers for the tenant.
  const surface = createSurfaceClient({
    baseUrl: options.surfaceURL.origin,
    accessToken: () => options.tokens.token(),
    fetch: (request) => options.fetch(request),
  });
  app.get("/readyz", async (request, reply) => {
    try {
      const { response } = await surface.GET("/v1/tenants/{tenant}/agents", {
        params: { path: { tenant: options.tenant } },
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) return { status: "ready" };
      return reply.code(503).send({ status: "not-ready", dac_plane: response.status });
    } catch (error) {
      request.log.warn({ err: error }, "dac-plane not ready");
      return reply.code(503).send({ status: "not-ready" });
    }
  });

  // What the web app needs to address the API.
  app.get("/api/config", async () => ({
    tenant: options.tenant,
    defaults: {
      runtime_provider_id: options.defaults?.runtimeProviderID ?? null,
      environment_provider_id: options.defaults?.environmentProviderID ?? null,
    },
  }));

  await registerProxy(app, options);
  if (options.webRoot) {
    await registerWeb(app, options.webRoot);
  }
  return app;
}
