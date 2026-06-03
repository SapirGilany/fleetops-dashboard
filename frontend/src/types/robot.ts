export interface Robot {
  id: string;
  missionId: string | null;
  state: {
    status: "idle" | "assigned" | "en_route" | "delivering" | "completed";
    startedAt: number;
    durationMs: number;
  };
}

export interface SystemStatus {
  totalRobots: number;
  availableRobots: number;
  busyRobots: number;
  pendingMissions: number;
}