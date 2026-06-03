import { Router } from "express";
import { systemController }
from "../controllers/systemController.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(
    systemController.getSystemStatus()
  );
});

export default router;