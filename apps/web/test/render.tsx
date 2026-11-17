import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";

export function renderAt(path: string, ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

export const tenant = "01a167fd-51d9-76ba-b563-496e2bd89646";

export const config = {
  tenant,
  defaults: {
    runtime_provider_id: "01a167fd-51d9-7d22-8a3b-6c5d4e3f2a10",
    environment_provider_id: "01a167fd-51d9-7d44-8a3b-6c5d4e3f2a12",
  },
};

export function agent(overrides: Record<string, unknown> = {}) {
  return {
    agent_id: "01a1e8af-fabd-7421-942c-2abdb0f53fda",
    tenant_id: tenant,
    created_by: "01a167fd-51d9-7a11-9f2e-5b4b3c2a1d00",
    name: "reviewer",
    role: "Reviews repositories",
    provider_id: config.defaults.runtime_provider_id,
    environment_provider_id: config.defaults.environment_provider_id,
    revision: 1,
    state: "active",
    version: 1,
    created_at: "2026-11-17T10:00:00Z",
    updated_at: "2026-11-17T10:00:00Z",
    ...overrides,
  };
}
