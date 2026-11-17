import { describe, expect, it } from "vitest";
import { ClientCredentials, type Fetch } from "../src/token.ts";

function issuer(answers: Array<() => Response>) {
  const requests: { url: string; init: RequestInit | undefined }[] = [];
  const fetch: Fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    const next = answers.shift();
    if (!next) throw new Error("unexpected token request");
    return next();
  };
  return { requests, fetch };
}

const token =
  (value: string, expiresIn = 300) =>
  () =>
    Response.json({ access_token: value, token_type: "Bearer", expires_in: expiresIn });

describe("ClientCredentials", () => {
  it("requests a token with the client credentials grant", async () => {
    const { requests, fetch } = issuer([token("t1")]);
    const source = new ClientCredentials({
      tokenURL: new URL("https://issuer:8443/default/token"),
      clientID: "surface-owner",
      clientSecret: "s3cret",
      scope: "dac-plane-surface",
      fetch,
    });

    await expect(source.token()).resolves.toBe("t1");

    const [request] = requests as [{ url: string; init: RequestInit }];
    expect(request.url).toBe("https://issuer:8443/default/token");
    expect(request.init.method).toBe("POST");
    const headers = new Headers(request.init.headers);
    expect(headers.get("authorization")).toBe(
      `Basic ${Buffer.from("surface-owner:s3cret").toString("base64")}`,
    );
    expect(String(request.init.body)).toBe("grant_type=client_credentials&scope=dac-plane-surface");
  });

  it("reuses a token until shortly before it expires, then renews it", async () => {
    let now = 0;
    const { requests, fetch } = issuer([token("t1", 300), token("t2", 300)]);
    const source = new ClientCredentials({
      tokenURL: new URL("https://issuer:8443/token"),
      clientID: "c",
      clientSecret: "s",
      scope: "x",
      fetch,
      now: () => now,
    });

    expect(await source.token()).toBe("t1");
    now = 269_000;
    expect(await source.token()).toBe("t1");
    now = 270_000;
    expect(await source.token()).toBe("t2");
    expect(requests).toHaveLength(2);
  });

  it("shares one request between concurrent callers", async () => {
    const { requests, fetch } = issuer([token("t1")]);
    const source = new ClientCredentials({
      tokenURL: new URL("https://issuer:8443/token"),
      clientID: "c",
      clientSecret: "s",
      scope: "x",
      fetch,
    });
    const tokens = await Promise.all([source.token(), source.token(), source.token()]);
    expect(tokens).toEqual(["t1", "t1", "t1"]);
    expect(requests).toHaveLength(1);
  });

  it("reports a refusal by status only, never the response body", async () => {
    const { fetch } = issuer([
      () => new Response('{"error":"invalid_client","echo":"s3cret"}', { status: 401 }),
    ]);
    const source = new ClientCredentials({
      tokenURL: new URL("https://issuer:8443/token"),
      clientID: "c",
      clientSecret: "s3cret",
      scope: "x",
      fetch,
    });
    await expect(source.token()).rejects.toThrow("token request refused: HTTP 401");
    await expect(source.token()).rejects.not.toThrow(/s3cret/);
  });
});
