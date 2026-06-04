import { robotService } from "../services/RobotService.js";
import { robotLifecycleService } from "../services/RobotLifecycleService.js";

export class RobotsController {
  getAllRobots() {
    const robots = robotService.getAllRobots();

    return robots.map((robot) => {
      const elapsed =
        Date.now() - robot.state.startedAt;

      const remainingTimeMs = Math.max(
        robot.state.durationMs - elapsed,
        0
      );

      return {
        id: robot.id,
        missionId: robot.missionId,

        // 👇 KEEP ORIGINAL STRUCTURE (IMPORTANT)
        state: robot.state,

        // 👇 extra computed field for UI
        remainingTimeMs,
      };
    });
  }

  getRobotById(id: string) {
    const robot = robotService.getRobot(id);

    if (!robot) {
      return null;
    }

    const elapsed =
      Date.now() - robot.state.startedAt;

    const remainingTimeMs = Math.max(
      robot.state.durationMs - elapsed,
      0
    );

    return {
      id: robot.id,
      missionId: robot.missionId,

      // keep full state
      state: robot.state,

      // computed UI helper
      remainingTimeMs,
    };
  }

  cancelMission(robotId: string) {
    const robot = robotService.getRobot(robotId);

    if (!robot) {
      return null;
    }

    robotLifecycleService.cancelMission(robot);

    return {
      robotId: robot.id,
      message: "Mission cancelled",
    };
  }
}

export const robotsController = new RobotsController();