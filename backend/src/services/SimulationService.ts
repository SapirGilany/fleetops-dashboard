import {
  availableRobots,
  pendingMissions,
  robots,
  missions,
  stats,
} from "../data/store.js";

import { simulationConfig } from "../config/simulationConfig.js";
import { log } from "../utils/logger.js";
import { missionService } from "./MissionService.js";
import { robotLifecycleService } from "./RobotLifecycleService.js";

export class SimulationService {
  /**
   * Starts the simulation engine.
   */
  private isRunning = false;
  private interval: NodeJS.Timeout | undefined;

  start() {
    if (this.isRunning) return;

    this.isRunning = true;

    this.interval = setInterval(() => {
      this.generateMissions(simulationConfig.missionGeneration.batchSize);
    }, simulationConfig.missionGeneration.intervalMs);

    log("INFO", "Simulation started");

  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    log("INFO", "Simulation stopped");
  }

  reset() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    this.isRunning = false;

    robotLifecycleService.clearAll();

    robots.clear();
    availableRobots.length = 0;
    pendingMissions.length = 0;

    missionService.reset();
  }

  robotBecameAvailable(robotId: string) {
    const mission = pendingMissions.shift();

    if (!mission) {
      availableRobots.push(robotId);
      return;
    }

    const robot = robots.get(robotId);
    if (!robot) return;

    mission.robotId = robot.id;

    robotLifecycleService.startMission(robot, mission);
  }

  /**
   * Creates a batch of missions.
   */
  private generateMissions(count: number) {
    for (let i = 0; i < count; i++) {
      this.assignMission();
    }


  }

  /**
   * Attempts to assign a mission immediately.
   * If no robot is available, the mission
   * is stored in the pending queue.
   */
  private assignMission() {
    const mission = missionService.createMission();

    const robotId = availableRobots.shift();

    if (!robotId) {
      pendingMissions.push(mission);
      return;
    }

    const robot = robots.get(robotId);

    if (!robot) {
      return;
    }

    mission.robotId = robot.id;

    robotLifecycleService.startMission(
      robot,
      mission
    );

    log("INFO", `Assigned ${mission.id} -> ${robot.id}`);

  }

  getSystemStats() {
    const activeMissions = Array.from(
      robots.values()
    ).filter(
      r =>
        r.missionId &&
        r.state.status !== "idle"
    ).length;

    return {
      totalMissions: missions.size,
      completedMissions: stats.completedMissions,
      pendingMissions: pendingMissions.length,
      activeMissions,
    };
  }
}

export const simulationService =
  new SimulationService();