// import express from "express";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/api/test", (req, res) => {
//   res.json({ message: "השרת שלך עובד!" });
// });

// app.listen(4000, () => {
//   console.log("Backend running on http://localhost:4000");
// });
import { app } from "./app.js";
import { bootstrap } from "./bootstrap.js";
import { log } from "./utils/logger.js";

const PORT = 3001;

bootstrap();

app.listen(PORT, () => {
  log(
    "INFO",
    `Server listening on port ${PORT}`
  );
});
