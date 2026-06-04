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
