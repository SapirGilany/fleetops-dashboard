const API_URL = "http://localhost:3001";

export async function fetchRobots() {
  const res = await fetch(`${API_URL}/robots`);
  return res.json();
}

export async function fetchSystem() {
  const res = await fetch(`${API_URL}/system`);
  return res.json();
}

export async function startSimulation() {
  await fetch(`${API_URL}/simulation/start`, {
    method: "POST",
  });
}

export const resetSimulation = async () => {
  await fetch("http://localhost:3001/simulation/reset", {
    method: "POST",
  });
};