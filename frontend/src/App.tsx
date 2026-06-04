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
  const [system, setSystem] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const isRunningRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const [robotsData, systemData] = await Promise.all([
        fetchRobots(),
        fetchSystem(),
      ]);

      setRobots(robotsData ?? []);
      setSystem(systemData ?? {});
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();

    const interval = window.setInterval(() => {
      if (isRunningRef.current) {
        loadData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loadData]);

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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>FleetOps Dashboard</h2>

        <div style={styles.buttons}>
          <button
            style={{
              ...styles.startBtn,
              opacity: isRunning ? 0.5 : 1,
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </button>

          <button
            style={{
              ...styles.resetBtn,
              opacity: !isRunning ? 0.5 : 1,
              cursor: !isRunning ? "not-allowed" : "pointer",
            }}
            onClick={handleReset}
            disabled={!isRunning}
          >
            Reset
          </button>
        </div>
      </div>

      {/* SYSTEM STATS */}
      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>STATUS</div>
          <div
            style={{
              ...styles.cardValue,
              color: isRunning ? "#22c55e" : "#ef4444",
            }}
          >
            {isRunning ? "RUNNING" : "STOPPED"}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>AVAILABLE ROBOTS</div>

          <div style={styles.cardValue}>
            {system?.availableRobots ?? 0}
            <span style={styles.cardSubValue}>
              / {system?.totalRobots ?? robots.length}
            </span>
          </div>
        </div>

        
      </div>

      {/* MISSIONS STATS (separate row) */}
      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>TOTAL MISSIONS</div>
          <div style={styles.cardValue}>
            {system?.totalMissions ?? 0}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>ACTIVE MISSIONS</div>
          <div style={styles.cardValue}>
            {system?.activeMissions ?? 0}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>PENDING MISSIONS</div>
          <div style={styles.cardValue}>
            {system?.pendingMissions ?? 0}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>CANCELLED MISSIONS</div>
          <div style={styles.cardValue}>
            {system?.cancelledMissions ?? 0}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>COMPLETED MISSIONS</div>
          <div style={styles.cardValue}>
            {system?.completedMissions ?? 0}
          </div>
        </div>
      </div>

      <RobotsTable robots={robots} onRefresh={loadData} />
    </div>
  );
}

export default App;

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
  },

  resetBtn: {
    padding: "8px 14px",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: 6,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },

  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 14,
    padding: 18,
  },

  cardLabel: {
    color: "#94a3b8",
    fontSize: 11,
    letterSpacing: "0.12em",
    marginBottom: 10,
  },

  cardValue: {
    fontSize: 28,
    fontWeight: 700,
  },

  cardSubValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#94a3b8",
    marginLeft: 6,
  },
};