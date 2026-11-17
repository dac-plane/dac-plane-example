import { describe, expect, it } from "vitest";
import { createSurfaceClient } from "../src/index.ts";

const tenant = "01a167fd-51d9-76ba-b563-496e2bd89646";
const task = "01a167fd-51d9-7000-8000-000000000001";

// recording answers every request with a new response from respond, since a
// response body can be read only once.
function recording(respond: () => Response) {
  const requests: Request[] = [];
  const fetch = async (request: Request) => {
    requests.push(request);
    return respond();
  };
  return { requests, fetch };
}

describe("createSurfaceClient", () => {
  it("sends a fresh bearer token and the typed path", async () => {
    const { requests, fetch } = recording(() =>
      Response.json({ task: { task_id: task } }, { status: 200 }),
    );
    let issued = 0;
    const client = createSurfaceClient({
      baseUrl: "https://dac-plane:8443",
      accessToken: async () => `token-${++issued}`,
      fetch,
    });

    await client.GET("/v1/tenants/{tenant}/tasks/{task}", {
      params: { path: { tenant, task } },
    });
    await client.GET("/v1/tenants/{tenant}/tasks/{task}", {
      params: { path: { tenant, task } },
    });

    expect(requests.map((r) => r.url)).toEqual([
      `https://dac-plane:8443/v1/tenants/${tenant}/tasks/${task}`,
      `https://dac-plane:8443/v1/tenants/${tenant}/tasks/${task}`,
    ]);
    expect(requests.map((r) => r.headers.get("Authorization"))).toEqual([
      "Bearer token-1",
      "Bearer token-2",
    ]);
  });

  it("returns a problem document as the error", async () => {
    const problem = { type: "https://dac-plane.dev/problems/not-found", title: "Not found" };
    const { fetch } = recording(
      () =>
        new Response(JSON.stringify(problem), {
          status: 404,
          headers: { "content-type": "application/problem+json" },
        }),
    );
    const client = createSurfaceClient({
      baseUrl: "https://dac-plane:8443",
      accessToken: async () => "token",
      fetch,
    });

    const { data, error, response } = await client.GET("/v1/tenants/{tenant}/tasks/{task}", {
      params: { path: { tenant, task } },
    });

    expect(data).toBeUndefined();
    expect(response.status).toBe(404);
    expect(error).toEqual(problem);
  });
});
