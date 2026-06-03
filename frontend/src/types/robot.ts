export interface Robot {
  id: string;
  status:
    | "idle"
    | "assigned"
    | "en_route"
    | "delivering"
    | "completed";

  missionId: string | null;

  remainingTimeMs: number;
}

export interface SystemStatus {
  totalRobots: number;
  availableRobots: number;
  busyRobots: number;
  pendingMissions: number;
}