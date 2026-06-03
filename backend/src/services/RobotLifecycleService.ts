import { simulationConfig } from "../config/simulationConfig.js";
import { availableRobots, robots, stats } from "../data/store.js";
import type { Mission } from "../types/mission.js";
import type { Robot } from "../types/robot.js";
import { log } from "../utils/logger.js";


export class RobotLifecycleService {
  private timeouts = new Set<NodeJS.Timeout>();
  /**
   * Starts a mission lifecycle for a specific robot.
   */
  startMission(robot: Robot, mission: Mission) {
    robot.missionId = mission.id;

    this.moveToAssigned(robot);
  }

  /**
   * First state after a robot receives a mission.
   */
  private moveToAssigned(robot: Robot) {
    const duration = this.randomBetween(
        simulationConfig.robotTimings.assigned.minMs,
        simulationConfig.robotTimings.assigned.maxMs
    );

    robot.state = {
      status: "assigned",
      startedAt: Date.now(),
      durationMs: duration,
    };

    robot.currentTimeout = this.registerTimeout(
      setTimeout(() => {
        this.moveToEnRoute(robot);
      }, duration)
    );

    log("INFO", `Robot ${robot.id} -> assigned`);
  }

  /**
   * Robot is travelling toward the destination.
   */
  private moveToEnRoute(robot: Robot) {
    const duration = this.randomBetween(
        simulationConfig.robotTimings.enRoute.minMs,
        simulationConfig.robotTimings.enRoute.maxMs
    );

    robot.state = {
      status: "en_route",
      startedAt: Date.now(),
      durationMs: duration,
    };

    robot.currentTimeout = this.registerTimeout(
      setTimeout(() => {
        this.moveToDelivering(robot);
      }, duration)
    );

    log("INFO", `Robot ${robot.id} -> en_route`);
  }

  /**
   * Robot is actively performing the delivery.
   */
  private moveToDelivering(robot: Robot) {
    const duration = this.randomBetween(
        simulationConfig.robotTimings.delivering.minMs,
        simulationConfig.robotTimings.delivering.maxMs
    );

    robot.state = {
      status: "delivering",
      startedAt: Date.now(),
      durationMs: duration,
    };

    robot.currentTimeout = this.registerTimeout(
      setTimeout(() => {
        this.moveToCompleted(robot);
      }, duration)
    );

    log("INFO", `Robot ${robot.id} -> delivering`);
  }

  /**
   * Mission finished successfully.
   */
  private moveToCompleted(robot: Robot) {
    const duration = simulationConfig.robotTimings.completed.fixedMs;

    robot.state = {
      status: "completed",
      startedAt: Date.now(),
      durationMs: duration,
    };

    stats.completedMissions++;

    robot.currentTimeout = this.registerTimeout(
      setTimeout(() => {
        this.moveToIdle(robot);
      }, duration)
    );

    log("INFO", `Robot ${robot.id} -> completed`);
  }

  /**
   * Robot becomes available again.
   */
  private moveToIdle(robot: Robot) {
    robot.missionId = null;

    robot.state = {
      status: "idle",
      startedAt: Date.now(),
      durationMs: 0,
    };

    log("INFO", `Robot ${robot.id} -> idle`);

    availableRobots.push(robot.id);
  }

  /**
   * Cancels the current mission immediately.
   */
  cancelMission(robot: Robot) {
    if (robot.state.status === "idle") {
      return;
    }

    if (robot.currentTimeout) {
      clearTimeout(robot.currentTimeout);
    }

    robot.missionId = null;

    robot.state = {
      status: "idle",
      startedAt: Date.now(),
      durationMs: 0,
    };

    log("INFO", `Robot ${robot.id} -> idle`);

    availableRobots.push(robot.id);
  }

  private registerTimeout(timeout: ReturnType<typeof setTimeout>) {
    this.timeouts.add(timeout);
    return timeout;
  }

  /**
   * Utility helper for random durations.
   */
  private randomBetween(min: number, max: number): number {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    );
  }

  clearAll() {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    this.timeouts.clear();
  }
}

export const robotLifecycleService =
  new RobotLifecycleService();