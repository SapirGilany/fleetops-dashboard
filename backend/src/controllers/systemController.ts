import { simulationConfig } from "../config/simulationConfig.js";
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
      totalMissions: missions.size + pendingMissions.length,
      activeMissions,
      pendingMissions: pendingMissions.length,
      cancelledMissions: stats.cancelledMissions,
      completedMissions: stats.completedMissions,
      fleetSize: simulationConfig.fleet.size,
      fleetOptions: simulationConfig.fleet.fleetOptions,
    };
  }
}

export const systemController =
  new SystemController();