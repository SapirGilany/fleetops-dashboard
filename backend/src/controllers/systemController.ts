import {
  availableRobots,
  pendingMissions,
  robots,
} from "../data/store.js";

export class SystemController {
  getSystemStatus() {
    return {
      totalRobots: robots.size,
      availableRobots: availableRobots.length,
      busyRobots:
        robots.size - availableRobots.length,
      pendingMissions: pendingMissions.length,
    };
  }
}

export const systemController =
  new SystemController();