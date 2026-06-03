import { useEffect, useState } from "react";

type RobotStatus =
  | "idle"
  | "assigned"
  | "en_route"
  | "delivering"
  | "completed";

type Robot = {
  id: string;
  missionId: string | null;
  state: {
    status: RobotStatus;
  };
};

export function RobotsTable() {
  const [robots, setRobots] = useState<Robot[]>([]);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const res = await fetch("http://localhost:3001/robots");
        const data = await res.json();
        setRobots(data);
      } catch (err) {
        console.error("Failed to fetch robots", err);
      }
    };

    fetchRobots(); // פעם ראשונה מיד

    const interval = setInterval(fetchRobots, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Mission</th>
        </tr>
      </thead>

      <tbody>
        {robots.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.state.status}</td>
            <td>{r.missionId ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}