import { missions } from "../data/store.js";
import type { Mission } from "../types/mission.js";
import { log } from "../utils/logger.js";

let missionCounter = 1;

export class MissionService {
  createMission(robotId: string): Mission {
    const mission: Mission = {
      id: `mission-${missionCounter++}`,
      createdAt: Date.now(),
      robotId,
    };

    missions.set(mission.id, mission);
    log("INFO", `Created mission ${mission.id}`);

    return mission;
  }

  reset() {
    missionCounter = 1;
  }
}

export const missionService = new MissionService();