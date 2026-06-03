import type { Mission } from "../types/mission.js";
import type { Robot } from "../types/robot.js";

export const robots = new Map<string, Robot>();

export const missions = new Map<string, Mission>();

export const availableRobots: string[] = [];

export const pendingMissions: Mission[] = [];

export const resetStore = () => {
  robots.clear();
  missions.clear();
  availableRobots.length = 0;
  pendingMissions.length = 0;
};