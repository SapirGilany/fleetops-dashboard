const API_URL = "http://localhost:3001";

export async function fetchRobots() {
  const res = await fetch(`${API_URL}/robots`);
  return res.json();
}

export async function fetchSystem() {
  const res = await fetch(`${API_URL}/system`);
  return res.json();
}

export async function startSimulation(
  fleetSize: number
) {
  await fetch(`${API_URL}/simulation/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fleetSize,
    }),
  });
}

export const resetSimulation = async () => {
  await fetch("http://localhost:3001/simulation/reset", {
    method: "POST",
  });
}

export async function cancelRobotMission(robotId: string) {
  const res = await fetch(`http://localhost:3001/robots/${robotId}/cancel`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to cancel mission");
  }

  return res.json();
}