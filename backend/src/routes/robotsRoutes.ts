import { Router } from "express";
import { robotsController }
from "../controllers/robotsController.js";

const router = Router();

router.get("/", (_req, res) => {
  const robots =
    robotsController.getAllRobots();

  res.json(robots);
});

router.get("/:id", (req, res) => {
  const robot =
    robotsController.getRobotById(
      req.params.id
    );

  if (!robot) {
    return res.status(404).json({
      message: "Robot not found",
    });
  }

  res.json(robot);
});

router.post("/:id/cancel", (req, res) => {
  const result =
    robotsController.cancelMission(
      req.params.id
    );

  if (!result) {
    return res.status(404).json({
      message: "Robot not found",
    });
  }

  res.json(result);
});

export default router;