import { useEffect, useRef, useState } from "react";
import {
  fetchRobots,
  fetchSystem,
  startSimulation,
  resetSimulation,
} from "./api/fleetApi";

function App() {
  const [robots, setRobots] = useState<any[]>([]);
  const [system, setSystem] = useState<any>({ pendingMissions: 0 });
  const [isRunning, setIsRunning] = useState(false);

  // חשוב מאוד לפולינג
  const isRunningRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [robotsData, systemData] = await Promise.all([
          fetchRobots(),
          fetchSystem(),
        ]);

        setRobots(robotsData ?? []);
        setSystem(systemData ?? { pendingMissions: 0 });
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    loadData();

    const interval = window.setInterval(() => {
      if (isRunningRef.current) {
        loadData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    await startSimulation();
    isRunningRef.current = true;
    setIsRunning(true);
  };

  const handleReset = async () => {
    await resetSimulation();
    isRunningRef.current = false;
    setIsRunning(false);
    setRobots([]);
    setSystem({ pendingMissions: 0 });
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>🚀 FleetOps Dashboard</h2>

        <div style={styles.buttons}>
          <button style={styles.startBtn} onClick={handleStart}>
            Start
          </button>

          <button style={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* STATUS */}
      <div style={styles.statusBar}>
        <span>
          Status:{" "}
          <b style={{ color: isRunning ? "#22c55e" : "#ef4444" }}>
            {isRunning ? "RUNNING" : "STOPPED"}
          </b>
        </span>

        <span>Robots: {robots.length}</span>
        <span>Missions: {system?.pendingMissions ?? 0}</span>
      </div>

      {/* TABLE */}
      <div style={styles.tableBox}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Mission</th>
            </tr>
          </thead>

          <tbody>
            {robots.map((r) => (
              <tr key={r.id} style={rowStyle}>
                <td style={tdStyle}>{r.id}</td>

                <td style={tdStyle}>
                  <span style={getStatusStyle(r.status)}>
                    {r.status ?? "unknown"}
                  </span>
                </td>

                <td style={tdStyle}>{r.missionId ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

/* ---------------- styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "Arial",
    background: "#0f172a",
    color: "white",
    minHeight: "100vh",
    padding: 20,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  buttons: {
    display: "flex",
    gap: 10,
  },

  startBtn: {
    padding: "8px 14px",
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },

  resetBtn: {
    padding: "8px 14px",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },

  statusBar: {
    display: "flex",
    gap: 20,
    padding: 12,
    background: "#111827",
    borderRadius: 8,
    marginBottom: 20,
  },

  tableBox: {
    background: "#111827",
    padding: 16,
    borderRadius: 10,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: 10,
  borderBottom: "1px solid #1f2937",
};

const tdStyle: React.CSSProperties = {
  padding: 10,
  borderTop: "1px solid #1f2937",
};

const rowStyle: React.CSSProperties = {
  transition: "0.2s",
};

/* status colors */
function getStatusStyle(status?: string): React.CSSProperties {
  const map: Record<string, string> = {
    idle: "#94a3b8",
    assigned: "#38bdf8",
    en_route: "#f59e0b",
    delivering: "#a78bfa",
    completed: "#22c55e",
  };

  return {
    padding: "4px 8px",
    borderRadius: 6,
    background: map[status || ""] || "#64748b",
    color: "black",
    fontSize: 12,
  };
}