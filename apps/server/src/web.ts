import fastifyStatic from "@fastify/static";
import type { FastifyInstance, FastifyReply } from "fastify";

// The page loads only this origin's own scripts, styles and API, and cannot be
// framed or post forms elsewhere.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ");

function secure(reply: FastifyReply) {
  reply.header("content-security-policy", contentSecurityPolicy);
  reply.header("x-content-type-options", "nosniff");
  reply.header("referrer-policy", "no-referrer");
}

// registerWeb serves the built web app from root. Vite fingerprints the files
// under /assets, so they are cached for good; index.html is never cached, so a
// new image is picked up on the next load. Any other GET a browser makes is a
// client-side route and gets index.html; /api and the health checks keep their
// own answers, including their 404s.
export async function registerWeb(app: FastifyInstance, root: string): Promise<void> {
  await app.register(fastifyStatic, {
    root,
    wildcard: true,
    index: false,
    dotfiles: "deny",
    cacheControl: false,
    setHeaders(reply, path) {
      reply.header(
        "cache-control",
        path.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
      );
    },
  });

  app.addHook("onSend", async (request, reply, payload) => {
    if (!request.url.startsWith("/api/")) secure(reply);
    return payload;
  });

  const index = (reply: FastifyReply) =>
    reply.header("cache-control", "no-cache").sendFile("index.html");

  // The root is a directory to the static handler, which lists none.
  app.get("/", (_request, reply) => index(reply));

  app.setNotFoundHandler((request, reply) => {
    const path = request.url.split("?")[0] ?? "";
    const api = path === "/api" || path.startsWith("/api/");
    if (request.method !== "GET" || api || path.startsWith("/assets/")) {
      return reply.code(404).type("application/problem+json").send({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "No such path.",
      });
    }
    return index(reply);
  });
}
