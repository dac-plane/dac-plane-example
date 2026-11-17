import { NavLink, Route, Routes } from "react-router";
import { AgentsPage } from "./pages/Agents.tsx";
import { AttentionPage } from "./pages/Attention.tsx";
import { TaskPage } from "./pages/Task.tsx";
import { TasksPage } from "./pages/Tasks.tsx";

export function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">dac-plane example</span>
        <nav>
          <NavLink to="/" end>
            Tasks
          </NavLink>
          <NavLink to="/attention">Attention</NavLink>
          <NavLink to="/agents">Agents</NavLink>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks/:taskID" element={<TaskPage />} />
          <Route path="/attention" element={<AttentionPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="*" element={<p>No such page.</p>} />
        </Routes>
      </main>
    </div>
  );
}
