import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchRobots,
  fetchSystem,
  startSimulation,
  resetSimulation,
} from "./api/fleetApi";

import RobotsTable from "./components/RobotsTable";
import type { Robot } from "./types/robot";
import type { SystemStatus } from "./types/robot";
import "./App.css";

function App() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [system, setSystem] = useState<SystemStatus>({});
  const [isRunning, setIsRunning] = useState(false);

  const [fleetSize, setFleetSize] = useState<number | null>(null);

  const isRunningRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const [robotsData, systemData] = await Promise.all([
        fetchRobots(),
        fetchSystem(),
      ]);

      setRobots(robotsData ?? []);
      setSystem(systemData ?? {});
      if (fleetSize === null) {
        setFleetSize(systemData.fleetSize);
      }
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
  if (fleetSize === null) return;

  await startSimulation(fleetSize);

  isRunningRef.current = true;
  setIsRunning(true);

  await loadData();
};

  const handleReset = async () => {
    await resetSimulation();
    isRunningRef.current = false;
    setIsRunning(false);
    await loadData();
  };

  return (
    <div className="page">
      <div className="header">
        <h2>FleetOps Dashboard</h2>

        <div className="buttons">
          <button
            className="start-btn"
            style={{
              opacity: isRunning ? 0.5 : 1,
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </button>

          <button
            className="reset-btn"
            style={{
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
      <div className="stats-grid">
        <div className="card">
          <div className="card-label">STATUS</div>
          <div
            className="card-value"
            style={{
              color: isRunning ? "#22c55e" : "#ef4444",
            }}
          >
            {isRunning ? "RUNNING" : "STOPPED"}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-label">
              AVAILABLE ROBOTS
            </div>

            <select
              value={fleetSize ?? ""}
              onChange={(e) =>
                setFleetSize(Number(e.target.value))
              }
              disabled={isRunning}
              className="fleet-select"
            >
              {(system?.fleetOptions ?? []).map(
                (size: number) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="card-value">
            {system?.availableRobots ?? 0}
            <span className="card-sub-value">
              / {system?.totalRobots ?? robots.length}
            </span>
          </div>
        </div>
        
      </div>

      {/* MISSIONS STATS (separate row) */}
      <div className="stats-grid">
        <div className="card">
          <div className="card-label">TOTAL MISSIONS</div>
          <div className="card-value">
            {system?.totalMissions ?? 0}
          </div>
        </div>

        <div className="card">
          <div className="card-label">ACTIVE MISSIONS</div>
          <div className="card-value">
            {system?.activeMissions ?? 0}
          </div>
        </div>

        <div className="card">
          <div className="card-label">PENDING MISSIONS</div>
          <div className="card-value">
            {system?.pendingMissions ?? 0}
          </div>
        </div>

        <div className="card">
          <div className="card-label">CANCELLED MISSIONS</div>
          <div className="card-value">
            {system?.cancelledMissions ?? 0}
          </div>
        </div>

        <div className="card">
          <div className="card-label">COMPLETED MISSIONS</div>
          <div className="card-value">
            {system?.completedMissions ?? 0}
          </div>
        </div>
      </div>

      <RobotsTable robots={robots} onRefresh={loadData} />
    </div>
  );
}

export default App;

// const styles: Record<string, React.CSSProperties> = {
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   buttons: {
//     display: "flex",
//     gap: 10,
//   },

//   startBtn: {
//     padding: "8px 14px",
//     background: "#22c55e",
//     border: "none",
//     color: "white",
//     borderRadius: 6,
//   },

//   resetBtn: {
//     padding: "8px 14px",
//     background: "#ef4444",
//     border: "none",
//     color: "white",
//     borderRadius: 6,
//   },

//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: 16,
//     marginBottom: 16,
//   },

//   card: {
//     background: "#111827",
//     border: "1px solid #1f2937",
//     borderRadius: 14,
//     padding: 18,
//   },

//   cardLabel: {
//     color: "#94a3b8",
//     fontSize: 11,
//     letterSpacing: "0.12em",
//     marginBottom: 10,
//   },

//   cardValue: {
//     fontSize: 28,
//     fontWeight: 700,
//   },

//   cardSubValue: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "#94a3b8",
//     marginLeft: 6,
//   },

//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   fleetSelect: {
//     background: "#1f2937",
//     color: "#f8fafc",
//     border: "1px solid #374151",
//     borderRadius: 8,
//     padding: "4px 10px",
//     fontSize: 12,
//     cursor: "pointer",
//     outline: "none",
//   },
// };