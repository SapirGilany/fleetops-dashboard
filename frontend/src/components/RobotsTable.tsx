import { cancelRobotMission } from "../api/fleetApi";

type Robot = {
  id: string;
  missionId: string | null;
  state: {
    status: "idle" | "assigned" | "en_route" | "delivering" | "completed";
  };
  remainingTimeMs: number;
};

type Props = {
  robots: Robot[];
  onRefresh: () => void;
};

export default function RobotsTable({ robots, onRefresh }: Props) {
  const handleCancel = async (id: string) => {
    await cancelRobotMission(id);
    onRefresh();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Robots Fleet</div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Mission</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {robots.map((r) => (
            <tr key={r.id} style={styles.row}>
              <td style={styles.td}>{r.id}</td>

              <td style={styles.td}>
                <span style={getBadge(r.state.status)}>
                  {r.state.status}
                </span>
              </td>

              <td style={styles.td}>{r.missionId ?? "-"}</td>

              <td style={styles.td}>
                <button
                  style={styles.btn}
                  onClick={() => handleCancel(r.id)}
                  disabled={r.state.status === "idle"}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#0b1220",
    borderRadius: 16,
    padding: 18,
    border: "1px solid #1f2937",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12,
    color: "#e5e7eb",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },

  th: {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  td: {
    padding: "12px",
    background: "#111827",
    color: "#e5e7eb",
  },

  row: {
    transition: "0.2s",
  },

  btn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
    fontSize: 12,
  },
};

/* badge */
function getBadge(status: string): React.CSSProperties {
  const colors: Record<string, string> = {
    idle: "#64748b",
    assigned: "#38bdf8",
    en_route: "#f59e0b",
    delivering: "#a78bfa",
    completed: "#22c55e",
  };

  return {
    padding: "4px 10px",
    borderRadius: 999,
    background: colors[status] || "#64748b",
    color: "#0b1220",
    fontSize: 12,
    fontWeight: 600,
  };
}