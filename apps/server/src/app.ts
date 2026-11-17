import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";

// buildApp assembles the server without starting it, so tests can drive it
// with inject() and main.ts owns the listening socket and the signals.
export function buildApp(options: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify(options);

  app.get("/healthz", async () => ({ status: "ok" }));

  return app;
}
