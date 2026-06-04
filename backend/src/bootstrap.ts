import { robotService } from "./services/RobotService.js";
import { simulationService } from "./services/SimulationService.js";
import { simulationConfig } from "./config/simulationConfig.js";
import { robotLifecycleService } from "./services/RobotLifecycleService.js";
import { log } from "./utils/logger.js";

export function bootstrap() {
  log("INFO", "booting system...");

  robotLifecycleService.setRobotAvailableHandler(
    simulationService.robotBecameAvailable.bind(
      simulationService
    )
  );

  robotService.createFleet(simulationConfig.fleet.size);
  log("INFO", `robots created: ${simulationConfig.fleet.size}`);

  log("INFO", "System ready (simulation is idle)");
}