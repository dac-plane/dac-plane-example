import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { surface, unwrap, useConfig } from "../api.ts";
import { formatTime, ProblemNotice, Section, StateBadge, shortID } from "../components.tsx";

// The attention inbox. Deciding requests arrives with the next stage of the
// plan; this lists what is waiting.
export function AttentionPage() {
  const config = useConfig();
  const tenant = config.data?.tenant;
  const attention = useQuery({
    queryKey: ["attention", tenant],
    enabled: tenant !== undefined,
    refetchInterval: 5000,
    queryFn: async () =>
      unwrap(
        await surface.GET("/v1/tenants/{tenant}/attention", {
          params: { path: { tenant: tenant ?? "" } },
        }),
      ).attention,
  });

  if (config.error) return <ProblemNotice error={config.error} />;
  return (
    <Section title="Waiting on you">
      <ProblemNotice error={attention.error} />
      {attention.isSuccess && attention.data.length === 0 ? (
        <p className="muted">Nothing is waiting on you.</p>
      ) : null}
      <ul className="list">
        {(attention.data ?? []).map((request) => (
          <li key={request.attention_id} className="row">
            <div className="row-main">
              <div>
                <Link to={`/tasks/${request.task_id}`}>Task {shortID(request.task_id)}</Link>{" "}
                <StateBadge state={request.state} />
              </div>
              <p className="muted">Asked {formatTime(request.created_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
