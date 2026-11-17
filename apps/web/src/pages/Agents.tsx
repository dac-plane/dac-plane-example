import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { type Agent, surface, unwrap, useConfig, type Versioned, versioned } from "../api.ts";
import { ProblemNotice, Section, StateBadge, shortID, useCommandKey } from "../components.tsx";

interface Profile {
  name: string;
  role: string;
  instructions?: string;
  provider_id: string;
  environment_provider_id: string;
}

const emptyProfile = (runtime: string | null, environment: string | null): Profile => ({
  name: "",
  role: "",
  provider_id: runtime ?? "",
  environment_provider_id: environment ?? "",
});

function profileOf(agent: Agent): Profile {
  return {
    name: agent.name,
    role: agent.role,
    ...(agent.instructions ? { instructions: agent.instructions } : {}),
    provider_id: agent.provider_id,
    environment_provider_id: agent.environment_provider_id,
  };
}

function ProfileForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: Profile;
  submitLabel: string;
  pending: boolean;
  onSubmit: (profile: Profile) => void;
  onCancel?: () => void;
}) {
  const [profile, setProfile] = useState(initial);
  const set = (field: keyof Profile) => (event: { target: { value: string } }) =>
    setProfile((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const instructions = profile.instructions?.trim();
    const { instructions: _omit, ...rest } = profile;
    onSubmit({ ...rest, name: profile.name.trim(), ...(instructions ? { instructions } : {}) });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Name
        <input required maxLength={100} value={profile.name} onChange={set("name")} />
      </label>
      <label>
        Role
        <input required maxLength={1000} value={profile.role} onChange={set("role")} />
      </label>
      <label>
        Standing instructions <span className="muted">(optional)</span>
        <textarea
          rows={4}
          maxLength={20000}
          value={profile.instructions ?? ""}
          onChange={set("instructions")}
        />
      </label>
      <label>
        Runtime provider
        <input
          required
          className="mono"
          value={profile.provider_id}
          onChange={set("provider_id")}
        />
      </label>
      <label>
        Environment provider
        <input
          required
          className="mono"
          value={profile.environment_provider_id}
          onChange={set("environment_provider_id")}
        />
      </label>
      <div className="actions">
        <button type="submit" disabled={pending}>
          {pending ? "Sending…" : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

function AgentRow({ tenant, agent }: { tenant: string; agent: Agent }) {
  const queryClient = useQueryClient();
  // The revision being edited and the version it was read at. Saving sends
  // that version as If-Match, so a change made by someone else meanwhile is
  // refused (412) instead of being overwritten.
  const [editing, setEditing] = useState<Versioned<Agent> | undefined>(undefined);
  const revise = useCommandKey();
  const retire = useCommandKey();

  const read = () =>
    surface
      .GET("/v1/tenants/{tenant}/agents/{agent}", {
        params: { path: { tenant, agent: agent.agent_id } },
      })
      .then(versioned);

  const startEditing = useMutation({ mutationFn: read, onSuccess: setEditing });

  const reviseAgent = useMutation({
    mutationFn: async ({ profile, etag }: { profile: Profile; etag: string }) =>
      unwrap(
        await surface.PUT("/v1/tenants/{tenant}/agents/{agent}", {
          params: {
            path: { tenant, agent: agent.agent_id },
            header: { "Idempotency-Key": revise.keyFor(profile), "If-Match": etag },
          },
          body: profile,
        }),
      ),
    onSuccess: () => {
      revise.done();
      setEditing(undefined);
      return queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });

  // Retiring depends on no field of the agent, only on it being active, so
  // it is based on a fresh read.
  const retireAgent = useMutation({
    mutationFn: async () => {
      const { etag } = await read();
      return unwrap(
        await surface.POST("/v1/tenants/{tenant}/agents/{agent}/retire", {
          params: {
            path: { tenant, agent: agent.agent_id },
            header: {
              "Idempotency-Key": retire.keyFor({ retire: agent.agent_id }),
              "If-Match": etag,
            },
          },
          body: {},
        }),
      );
    },
    onSuccess: () => {
      retire.done();
      return queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });

  return (
    <li className="row">
      <div className="row-main">
        <div>
          <strong>{agent.name}</strong> <StateBadge state={agent.state} />{" "}
          <span className="muted">revision {agent.revision}</span>
        </div>
        <p>{agent.role}</p>
        {agent.instructions ? <p className="muted pre">{agent.instructions}</p> : null}
        <p className="muted mono">{shortID(agent.agent_id)}</p>
      </div>
      {agent.state === "active" && !editing ? (
        <div className="actions">
          <button
            type="button"
            className="secondary"
            disabled={startEditing.isPending}
            onClick={() => startEditing.mutate()}
          >
            Revise
          </button>
          <button
            type="button"
            className="danger"
            disabled={retireAgent.isPending}
            onClick={() => {
              if (window.confirm(`Retire ${agent.name}? It takes no new tasks.`))
                retireAgent.mutate();
            }}
          >
            Retire
          </button>
        </div>
      ) : null}
      {editing ? (
        <ProfileForm
          initial={profileOf(editing.value)}
          submitLabel={`Save revision ${editing.value.revision + 1}`}
          pending={reviseAgent.isPending}
          onSubmit={(profile) => reviseAgent.mutate({ profile, etag: editing.etag })}
          onCancel={() => {
            setEditing(undefined);
            reviseAgent.reset();
          }}
        />
      ) : null}
      <ProblemNotice error={startEditing.error ?? reviseAgent.error ?? retireAgent.error} />
    </li>
  );
}

export function AgentsPage() {
  const config = useConfig();
  const tenant = config.data?.tenant;
  const queryClient = useQueryClient();
  const create = useCommandKey();
  const [creating, setCreating] = useState(false);

  const agents = useQuery({
    queryKey: ["agents", tenant],
    enabled: tenant !== undefined,
    queryFn: async () =>
      unwrap(
        await surface.GET("/v1/tenants/{tenant}/agents", {
          params: { path: { tenant: tenant ?? "" } },
        }),
      ).agents,
  });

  const createAgent = useMutation({
    mutationFn: async (profile: Profile) =>
      unwrap(
        await surface.POST("/v1/tenants/{tenant}/agents", {
          params: {
            path: { tenant: tenant ?? "" },
            header: { "Idempotency-Key": create.keyFor(profile) },
          },
          body: profile,
        }),
      ),
    onSuccess: () => {
      create.done();
      setCreating(false);
      return queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });

  if (config.error) return <ProblemNotice error={config.error} />;
  if (!tenant || !config.data) return <p className="muted">Loading…</p>;

  const list = agents.data ?? [];
  const active = list.filter((a) => a.state === "active");
  const retired = list.filter((a) => a.state === "retired");

  return (
    <>
      <Section
        title="Agents"
        actions={
          creating ? null : (
            <button type="button" onClick={() => setCreating(true)}>
              New agent
            </button>
          )
        }
      >
        {creating ? (
          <>
            <ProfileForm
              initial={emptyProfile(
                config.data.defaults.runtime_provider_id,
                config.data.defaults.environment_provider_id,
              )}
              submitLabel="Create agent"
              pending={createAgent.isPending}
              onSubmit={(profile) => createAgent.mutate(profile)}
              onCancel={() => setCreating(false)}
            />
            <ProblemNotice error={createAgent.error} />
          </>
        ) : null}
        <ProblemNotice error={agents.error} />
        {agents.isPending ? <p className="muted">Loading agents…</p> : null}
        {agents.isSuccess && active.length === 0 ? (
          <p className="muted">No active agents yet. Create one to delegate work to it.</p>
        ) : null}
        <ul className="list">
          {active.map((agent) => (
            <AgentRow key={agent.agent_id} tenant={tenant} agent={agent} />
          ))}
        </ul>
      </Section>
      {retired.length > 0 ? (
        <Section title="Retired">
          <ul className="list">
            {retired.map((agent) => (
              <AgentRow key={agent.agent_id} tenant={tenant} agent={agent} />
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
