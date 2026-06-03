export type RobotStatus =
  | "idle"
  | "assigned"
  | "en_route"
  | "delivering"
  | "completed";

export interface RobotState {
  status: RobotStatus;
  startedAt: number;
  durationMs: number;
}

export interface Robot {
  id: string;
  missionId: string | null;
  state: RobotState;
  currentTimeout?: ReturnType<typeof setTimeout>;
}