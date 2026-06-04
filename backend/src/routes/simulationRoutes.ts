import { Router } from "express";
import { simulationService } from "../services/SimulationService.js";
import { robotService } from "../services/RobotService.js";
import { simulationConfig } from "../config/simulationConfig.js";
import { log } from "../utils/logger.js";

const router = Router();

/**
 * Start simulation
 */
router.post("/start", (_req, res) => {
  simulationService.start();
  res.json({ status: "started" });
});

/**
 * Reset simulation (FULL CLEAN STATE)
 */
router.post("/reset", (_req, res) => {
  log("WARN", "Simulation reset");
  simulationService.reset();
  robotService.resetFleet(simulationConfig.fleet.size);

  res.json({ status: "reset" });
});

export default router;