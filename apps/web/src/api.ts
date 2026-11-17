import { createSurfaceClient, type Problem, type Schemas } from "@dac-plane-example/surface-client";
import { useQuery } from "@tanstack/react-query";

export type Agent = Schemas["agent.schema"];
export type TaskView = Schemas["task-view.schema"];
export type Task = Schemas["task.schema"];
export type Event = Schemas["event.schema"];

// The browser calls the application's own server, which adds the token and
// forwards to the Surface API (apps/server/src/proxy.ts).
export const surface = createSurfaceClient({ baseUrl: `${window.location.origin}/api` });

/** A refused or failed request, carrying dac-plane's problem document when it sent one. */
export class APIError extends Error {
  readonly status: number;
  readonly problem: Problem | undefined;

  constructor(status: number, problem: Problem | undefined) {
    super(problem?.title ?? `HTTP ${status}`);
    this.status = status;
    this.problem = problem;
  }
}

interface Result<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

const isProblem = (value: unknown): value is Problem =>
  typeof value === "object" && value !== null && "title" in value && "type" in value;

/** Returns the body of a successful response, or throws an APIError with the problem. */
export function unwrap<T>({ data, error, response }: Result<T>): T {
  if (!response.ok || data === undefined) {
    throw new APIError(response.status, isProblem(error) ? error : undefined);
  }
  return data;
}

/** A read with the ETag that commands changing the record send as If-Match. */
export interface Versioned<T> {
  value: T;
  etag: string;
}

export function versioned<T>(result: Result<T>): Versioned<T> {
  const value = unwrap(result);
  const etag = result.response.headers.get("etag");
  if (!etag) {
    throw new APIError(result.response.status, undefined);
  }
  return { value, etag };
}

export interface AppConfig {
  tenant: string;
  defaults: { runtime_provider_id: string | null; environment_provider_id: string | null };
}

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<AppConfig> => {
      const response = await fetch("/api/config");
      if (!response.ok) throw new APIError(response.status, undefined);
      return (await response.json()) as AppConfig;
    },
  });
}

/** The Surface API path of an event stream, as served through the application's server. */
export const streamPath = (tenant: string, task?: string) =>
  task ? `/api/v1/tenants/${tenant}/tasks/${task}/events` : `/api/v1/tenants/${tenant}/events`;
