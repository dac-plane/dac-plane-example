import { type ReactNode, useCallback, useRef } from "react";
import { APIError } from "./api.ts";
import type { StreamState } from "./events.ts";

// ProblemNotice shows a failure as dac-plane reported it: its status, title
// and detail. The application never replaces it with a friendlier guess.
export function ProblemNotice({ error }: { error: unknown }) {
  if (!error) return null;
  if (error instanceof APIError) {
    return (
      <div role="alert" className="problem">
        <strong>
          {error.status} {error.problem?.title ?? "Request failed"}
        </strong>
        {error.problem?.detail ? <p>{error.problem.detail}</p> : null}
        {error.problem?.type && error.problem.type !== "about:blank" ? (
          <p className="muted">
            <code>{error.problem.type}</code>
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div role="alert" className="problem">
      <strong>{error instanceof Error ? error.message : "Request failed"}</strong>
    </div>
  );
}

export function StateBadge({ state }: { state: string }) {
  return <span className={`badge badge-${state}`}>{state.replaceAll("_", " ")}</span>;
}

export function StreamIndicator({ state }: { state: StreamState }) {
  const label = {
    connecting: "Connecting to live updates",
    open: "Live",
    reconnecting: "Reconnecting",
    closed: "Live updates stopped",
  }[state];
  return (
    <span className={`stream stream-${state}`} aria-live="polite">
      {label}
    </span>
  );
}

export function Section({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="card">
      <header className="card-header">
        <h2>{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}

// useCommandKey gives the Idempotency-Key for one intended command. Sending
// the same body again (a retry after a timeout or a lost response) reuses
// the key, so dac-plane answers with the original result instead of acting
// twice. A different body is a different command and gets a new key, since
// dac-plane refuses a reused key with another body (422).
export function useCommandKey(): { keyFor: (body: unknown) => string; done: () => void } {
  const last = useRef<{ body: string; key: string } | undefined>(undefined);
  const keyFor = useCallback((body: unknown) => {
    const serialized = JSON.stringify(body);
    if (last.current?.body !== serialized) {
      last.current = { body: serialized, key: crypto.randomUUID() };
    }
    return last.current.key;
  }, []);
  // After a command succeeds, the next one is new even with the same body.
  const done = useCallback(() => {
    last.current = undefined;
  }, []);
  return { keyFor, done };
}

export function shortID(id: string): string {
  return id.slice(-12);
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}
