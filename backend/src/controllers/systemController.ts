import {
  availableRobots,
  pendingMissions,
  robots,
  missions,
  stats,
} from "../data/store.js";

export class SystemController {
  getSystemStatus() {
    const activeMissions = Array.from(
      robots.values()
    ).filter(
      robot => robot.missionId !== null
    ).length;


    return {
      totalRobots: robots.size,
      availableRobots: availableRobots.length,
      busyRobots:
        robots.size - availableRobots.length,
      totalMissions: missions.size,
      activeMissions,
      pendingMissions: pendingMissions.length,
      completedMissions: stats.completedMissions,
    };
  }
}

export const systemController =
  new SystemController();