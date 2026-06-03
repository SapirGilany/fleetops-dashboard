import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchRobots,
  fetchSystem,
  startSimulation,
  resetSimulation,
} from "./api/fleetApi";

import RobotsTable from "./components/RobotsTable";

function App() {
  const [robots, setRobots] = useState<any[]>([]);
  const [system, setSystem] = useState<any>({ pendingMissions: 0 });
  const [isRunning, setIsRunning] = useState(false);

  const isRunningRef = useRef(false);

  // -------------------------
  // DATA LOADER (single source of truth)
  // -------------------------
  const loadData = useCallback(async () => {
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
  }, []);

  // -------------------------
  // INIT + POLLING
  // -------------------------
  useEffect(() => {
    loadData();

    const interval = window.setInterval(() => {
      if (isRunningRef.current) {
        loadData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loadData]);

  // -------------------------
  // ACTIONS
  // -------------------------
  const handleStart = async () => {
    await startSimulation();
    isRunningRef.current = true;
    setIsRunning(true);
  };

  const handleReset = async () => {
    await resetSimulation();
    isRunningRef.current = false;
    setIsRunning(false);

    await loadData();
  };

  // -------------------------
  // UI
  // -------------------------
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

      {/* STATUS BAR */}
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

      {/* TABLE (now clean component) */}
      <RobotsTable robots={robots} onRefresh={loadData} />
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
    boxSizing: "border-box",
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
};