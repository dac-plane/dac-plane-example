import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// Every /api call carries the owner's authority, so only this application's
// own pages may make one. Three checks, each closing a different way in:
//
// - Host: a page on a domain that resolves to this server (DNS rebinding) is
//   same-origin to the browser, but names its own domain in Host.
// - Fetch Metadata: a browser states whether a request came from another site
//   (RFC 10017 requires a backend for frontend to defend against CSRF).
// - Origin: a browser that sends no Fetch Metadata still names the origin of
//   every POST and PUT, so writes without either are refused.
//
// Health checks and the web app's files are not under /api and carry no
// authority, so they are not checked.

const writes = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function refuse(reply: FastifyReply, detail: string) {
  return reply.code(403).type("application/problem+json").send({
    type: "about:blank",
    title: "Forbidden",
    status: 403,
    detail,
  });
}

/** The authority (`host:port`) of an Origin header, or undefined when it is not one. */
function originAuthority(origin: string): string | undefined {
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    const port = url.port || (url.protocol === "https:" ? "443" : "80");
    return `${url.hostname.toLowerCase()}:${port}`;
  } catch {
    return undefined;
  }
}

/** Normalizes a Host header to `host:port`, adding the default HTTP port. */
function hostAuthority(host: string): string {
  const value = host.trim().toLowerCase();
  return /:\d+$/.test(value) ? value : `${value}:80`;
}

const isApi = (path: string) => path === "/api" || path.startsWith("/api/");

// underApi decides by the route the router matched, which is what runs: the
// router decodes the path (`/%61pi/config` matches `/api/config`), so the raw
// URL alone is not enough. The raw prefix is checked too, for requests that
// match no route.
function underApi(request: FastifyRequest): boolean {
  const route = request.routeOptions.url;
  return (route !== undefined && isApi(route)) || isApi(request.url.split("?")[0] ?? "");
}

export function registerGuard(app: FastifyInstance, allowedHosts: readonly string[]): void {
  const allowed = new Set(allowedHosts.map(hostAuthority));

  app.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    if (!underApi(request)) return;

    const host = request.headers.host;
    if (!host || !allowed.has(hostAuthority(host))) {
      return refuse(reply, "This application does not answer for that host.");
    }

    const site = request.headers["sec-fetch-site"];
    if (site !== undefined) {
      if (site !== "same-origin" && site !== "none") {
        return refuse(reply, "Only this application's own pages may call it.");
      }
      return;
    }

    const origin = request.headers.origin;
    if (origin !== undefined) {
      const authority = originAuthority(origin);
      if (!authority || !allowed.has(authority)) {
        return refuse(reply, "Only this application's own pages may call it.");
      }
      return;
    }

    if (writes.has(request.method)) {
      return refuse(reply, "A change needs the Origin of the page that makes it.");
    }
  });
}
