import { availableRobots, robots } from "../data/store.js";
import type { Robot } from "../types/robot.js";

export class RobotService {
  createFleet(size: number) {
    for (let i = 1; i <= size; i++) {
      const robot: Robot = {
        id: `robot-${String(i).padStart(3, "0")}`,
        missionId: null,
        state: {
          status: "idle",
          startedAt: 0,
          durationMs: 0,
        },
      };

      robots.set(robot.id, robot);
      availableRobots.push(robot.id);
    }
  }

  getAllRobots() {
    return Array.from(robots.values());
  }

  getRobot(id: string) {
    return robots.get(id);
  }

  resetFleet(size: number) {
    robots.clear();
    availableRobots.length = 0;

    for (let i = 1; i <= size; i++) {
      const robot: Robot = {
        id: `robot-${String(i).padStart(3, "0")}`,
        missionId: null,
        state: {
          status: "idle",
          startedAt: 0,
          durationMs: 0,
        },
      };

      robots.set(robot.id, robot);
      availableRobots.push(robot.id);
    }
  }
}

export const robotService = new RobotService();