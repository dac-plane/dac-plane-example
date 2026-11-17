export type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface TokenSource {
  /** A current access token for the Surface API. */
  token(): Promise<string>;
}

export interface ClientCredentialsOptions {
  tokenURL: URL;
  clientID: string;
  clientSecret: string;
  scope: string;
  fetch: Fetch;
  /** Renew this long before the token expires. */
  skewSeconds?: number;
  now?: () => number;
}

// ClientCredentials obtains tokens for one service principal with the OAuth
// 2.0 client credentials grant (ADR-0007's machine surfaces) and reuses each
// until shortly before it expires. Concurrent callers share one request.
export class ClientCredentials implements TokenSource {
  readonly #options: ClientCredentialsOptions;
  #cached: { token: string; renewAt: number } | undefined;
  #pending: Promise<string> | undefined;

  constructor(options: ClientCredentialsOptions) {
    this.#options = options;
  }

  async token(): Promise<string> {
    const now = (this.#options.now ?? Date.now)();
    if (this.#cached && now < this.#cached.renewAt) {
      return this.#cached.token;
    }
    this.#pending ??= this.#request().finally(() => {
      this.#pending = undefined;
    });
    return this.#pending;
  }

  async #request(): Promise<string> {
    const { tokenURL, clientID, clientSecret, scope, fetch } = this.#options;
    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${encodeURIComponent(clientID)}:${encodeURIComponent(clientSecret)}`).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: new URLSearchParams({ grant_type: "client_credentials", scope }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      // The body may echo request details; only the status is reported.
      throw new Error(`token request refused: HTTP ${response.status}`);
    }
    const body = (await response.json()) as { access_token?: unknown; expires_in?: unknown };
    if (typeof body.access_token !== "string" || body.access_token === "") {
      throw new Error("token response has no access_token");
    }
    const lifetime = typeof body.expires_in === "number" ? body.expires_in : 60;
    const skew = this.#options.skewSeconds ?? 30;
    const now = (this.#options.now ?? Date.now)();
    this.#cached = {
      token: body.access_token,
      renewAt: now + Math.max(lifetime - skew, 0) * 1000,
    };
    return body.access_token;
  }
}
