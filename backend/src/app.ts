import express from "express";
import cors from "cors";

import robotsRoutes
from "./routes/robotsRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";


export const app = express();

app.use(cors());

app.use(express.json());

app.use("/robots", robotsRoutes);
app.use("/system", systemRoutes);
app.use("/simulation", simulationRoutes);