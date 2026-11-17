import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { streamPath, surface, unwrap, useConfig } from "../api.ts";
import {
  formatTime,
  ProblemNotice,
  Section,
  StateBadge,
  StreamIndicator,
  shortID,
  useCommandKey,
} from "../components.tsx";
import { useEventStream } from "../events.ts";

interface IndexedTask {
  state: string;
  updatedAt: string;
}

// useTaskIndex lists the tenant's tasks from its event stream. The Surface API
// has no task list (dac-plane#155): the stream, read from its start, names
// every task this principal can read and each state change, and then keeps
// the list current. After a reset the stream is read again from the start.
function useTaskIndex(tenant: string | undefined) {
  const [tasks, setTasks] = useState(new Map<string, IndexedTask>());
  const [epoch, setEpoch] = useState(0);
  const state = useEventStream(tenant ? `${streamPath(tenant)}#${epoch}` : undefined, {
    onEvent: (event) => {
      if (event.record_kind !== "task" || !event.to_state) return;
      const { record_id, to_state, occurred_at } = event;
      setTasks((current) =>
        new Map(current).set(record_id, { state: to_state, updatedAt: occurred_at }),
      );
    },
    onReset: () => {
      setTasks(new Map());
      setEpoch((n) => n + 1);
    },
  });
  return { tasks, state };
}

function TaskRow({ tenant, id, entry }: { tenant: string; id: string; entry: IndexedTask }) {
  const task = useQuery({
    queryKey: ["task", tenant, id],
    queryFn: async () =>
      unwrap(
        await surface.GET("/v1/tenants/{tenant}/tasks/{task}", {
          params: { path: { tenant, task: id } },
        }),
      ),
  });
  return (
    <li className="row">
      <div className="row-main">
        <div>
          <Link to={`/tasks/${id}`}>
            <strong>{task.data?.task.objective ?? shortID(id)}</strong>
          </Link>{" "}
          <StateBadge state={entry.state} />
        </div>
        <p className="muted">
          Updated {formatTime(entry.updatedAt)} · <span className="mono">{shortID(id)}</span>
        </p>
      </div>
    </li>
  );
}

interface Brief {
  agentID: string;
  objective: string;
  criteria: string;
  deadline: string;
  unit: string;
  ceiling: number;
  amount: number;
}

const inAnHour = () => {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setSeconds(0, 0);
  // datetime-local wants local time without a zone.
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

function SubmitForm({ tenant }: { tenant: string }) {
  const navigate = useNavigate();
  const submit = useCommandKey();
  const agents = useQuery({
    queryKey: ["agents", tenant],
    queryFn: async () =>
      unwrap(await surface.GET("/v1/tenants/{tenant}/agents", { params: { path: { tenant } } }))
        .agents,
  });
  const active = (agents.data ?? []).filter((a) => a.state === "active");
  const [brief, setBrief] = useState<Brief>({
    agentID: "",
    objective: "",
    criteria: "",
    deadline: inAnHour(),
    unit: "tokens",
    ceiling: 1000,
    amount: 100,
  });
  const set = (field: keyof Brief) => (event: { target: { value: string } }) =>
    setBrief((current) => ({
      ...current,
      [field]:
        field === "ceiling" || field === "amount" ? Number(event.target.value) : event.target.value,
    }));

  const submitTask = useMutation({
    mutationFn: async () => {
      const body = {
        agent_id: brief.agentID || (active[0]?.agent_id ?? ""),
        objective: brief.objective.trim(),
        acceptance_criteria: brief.criteria
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        demand: "person" as const,
        deadline: new Date(brief.deadline).toISOString(),
        unit: brief.unit,
        ceiling: brief.ceiling,
        amount: brief.amount,
      };
      return unwrap(
        await surface.POST("/v1/tenants/{tenant}/tasks", {
          params: { path: { tenant }, header: { "Idempotency-Key": submit.keyFor(body) } },
          body,
        }),
      );
    },
    onSuccess: (submission) => {
      submit.done();
      navigate(`/tasks/${submission.task.task_id}`);
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitTask.mutate();
  };

  if (agents.isSuccess && active.length === 0) {
    return (
      <p className="muted">
        No active agent to delegate to. <Link to="/agents">Create an agent</Link> first.
      </p>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Agent
        <select value={brief.agentID || (active[0]?.agent_id ?? "")} onChange={set("agentID")}>
          {active.map((agent) => (
            <option key={agent.agent_id} value={agent.agent_id}>
              {agent.name}: {agent.role}
            </option>
          ))}
        </select>
      </label>
      <label>
        Objective
        <textarea
          required
          rows={3}
          maxLength={10000}
          value={brief.objective}
          onChange={set("objective")}
        />
      </label>
      <label>
        Acceptance criteria <span className="muted">(one per line)</span>
        <textarea required rows={3} value={brief.criteria} onChange={set("criteria")} />
      </label>
      <div className="grid">
        <label>
          Deadline
          <input required type="datetime-local" value={brief.deadline} onChange={set("deadline")} />
        </label>
        <label>
          Budget unit
          <input
            required
            pattern="[a-z][a-z0-9_]{0,31}"
            value={brief.unit}
            onChange={set("unit")}
          />
        </label>
        <label>
          Ceiling
          <input required type="number" min={1} value={brief.ceiling} onChange={set("ceiling")} />
        </label>
        <label>
          Reserved to start
          <input required type="number" min={1} value={brief.amount} onChange={set("amount")} />
        </label>
      </div>
      <div className="actions">
        <button type="submit" disabled={submitTask.isPending || agents.isPending}>
          {submitTask.isPending ? "Submitting…" : "Delegate task"}
        </button>
      </div>
      <ProblemNotice error={agents.error ?? submitTask.error} />
    </form>
  );
}

export function TasksPage() {
  const config = useConfig();
  const tenant = config.data?.tenant;
  const { tasks, state } = useTaskIndex(tenant);
  const [submitting, setSubmitting] = useState(false);

  if (config.error) return <ProblemNotice error={config.error} />;
  if (!tenant) return <p className="muted">Loading…</p>;

  const newestFirst = [...tasks.entries()].sort(([, a], [, b]) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  return (
    <>
      <Section
        title="Delegate a task"
        actions={
          submitting ? null : (
            <button type="button" onClick={() => setSubmitting(true)}>
              New task
            </button>
          )
        }
      >
        {submitting ? <SubmitForm tenant={tenant} /> : null}
      </Section>
      <Section title="Tasks" actions={<StreamIndicator state={state} />}>
        {newestFirst.length === 0 ? (
          <p className="muted">{state === "open" ? "No tasks yet." : "Reading tasks…"}</p>
        ) : null}
        <ul className="list">
          {newestFirst.map(([id, entry]) => (
            <TaskRow key={id} tenant={tenant} id={id} entry={entry} />
          ))}
        </ul>
      </Section>
    </>
  );
}
