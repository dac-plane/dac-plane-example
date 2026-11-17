import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Fetch, TokenSource } from "./token.ts";

export interface ProxyOptions {
  surfaceURL: URL;
  tenant: string;
  tokens: TokenSource;
  fetch: Fetch;
  /** How long a request other than an event stream may take. */
  timeoutMs?: number;
}

// Headers a surface sends that dac-plane's commands and streams depend on:
// idempotency and versions for commands, the cursor for a resumed stream.
const forwardedRequestHeaders = [
  "accept",
  "content-type",
  "idempotency-key",
  "if-match",
  "last-event-id",
];
const forwardedResponseHeaders = [
  "content-type",
  "etag",
  "location",
  "retry-after",
  "cache-control",
];

// A path below the tenant: identifier-like segments only, so nothing can
// climb out of /v1/tenants/{tenant} on the way to dac-plane.
const segment = /^[A-Za-z0-9._~-]+$/;

function problem(reply: FastifyReply, status: number, title: string, detail: string) {
  return reply
    .code(status)
    .type("application/problem+json")
    .send({ type: "about:blank", title, status, detail });
}

// registerProxy serves /api/v1/tenants/{tenant}/... by calling the same path
// on the Surface API with this application's token. The browser therefore
// uses the generated client unchanged and never holds a token (the Backend
// for Frontend pattern). Problems from dac-plane are passed through as they
// are; failures to reach it are reported as 502, never hidden.
export async function registerProxy(app: FastifyInstance, options: ProxyOptions): Promise<void> {
  const timeoutMs = options.timeoutMs ?? 30_000;

  await app.register(async (scope) => {
    // Bodies are relayed as bytes: their exact form is what an
    // Idempotency-Key was first used with.
    scope.removeAllContentTypeParsers();
    scope.addContentTypeParser("*", { parseAs: "buffer", bodyLimit: 1 << 20 }, (_req, body, done) =>
      done(null, body),
    );

    const handler = async (request: FastifyRequest, reply: FastifyReply) => {
      const raw = request.raw.url ?? "";
      const queryAt = raw.indexOf("?");
      const path = (queryAt < 0 ? raw : raw.slice(0, queryAt)).replace(/^\/api/, "");
      const query = queryAt < 0 ? "" : raw.slice(queryAt);

      const segments = path.split("/").slice(1);
      if (
        segments.length < 3 ||
        segments[0] !== "v1" ||
        segments[1] !== "tenants" ||
        segments.some((s) => !segment.test(s) || s === "." || s === "..")
      ) {
        return problem(reply, 404, "Not Found", "No such Surface API path.");
      }
      if (segments[2] !== options.tenant) {
        return problem(reply, 404, "Not Found", "This application serves one tenant.");
      }

      const headers = new Headers();
      for (const name of forwardedRequestHeaders) {
        const value = request.headers[name];
        if (typeof value === "string") headers.set(name, value);
      }

      let token: string;
      try {
        token = await options.tokens.token();
      } catch (error) {
        request.log.error({ err: error }, "access token unavailable");
        return problem(
          reply,
          502,
          "Bad Gateway",
          "No access token could be obtained for dac-plane.",
        );
      }
      headers.set("authorization", `Bearer ${token}`);

      const streaming = headers.get("accept")?.includes("text/event-stream") ?? false;
      const closed = new AbortController();
      request.raw.on("close", () => closed.abort());
      reply.raw.on("close", () => closed.abort());
      const signal = streaming
        ? closed.signal
        : AbortSignal.any([closed.signal, AbortSignal.timeout(timeoutMs)]);

      const target = new URL(`${path}${query}`, options.surfaceURL);
      let upstream: Response;
      try {
        upstream = await options.fetch(target, {
          method: request.method,
          headers,
          ...(request.body instanceof Buffer ? { body: request.body } : {}),
          signal,
        });
      } catch (error) {
        if (closed.signal.aborted) return reply;
        request.log.error({ err: error }, "dac-plane unreachable");
        return problem(reply, 502, "Bad Gateway", "dac-plane could not be reached.");
      }

      reply.code(upstream.status);
      for (const name of forwardedResponseHeaders) {
        const value = upstream.headers.get(name);
        if (value === null) continue;
        // dac-plane names a created record by its Surface API path; the
        // browser reaches that path through this server's /api prefix.
        reply.header(
          name,
          name === "location" && value.startsWith("/v1/") ? `/api${value}` : value,
        );
      }
      if (streaming) {
        reply.header("x-accel-buffering", "no");
      }
      if (!upstream.body) {
        return reply.send();
      }
      const body = Readable.fromWeb(upstream.body as WebReadableStream<Uint8Array>);
      body.on("error", () => closed.abort());
      return reply.send(body);
    };

    scope.route({ method: ["GET", "POST", "PUT"], url: "/api/v1/*", handler });
  });
}
