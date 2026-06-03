type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Pads log level so logs align nicely in terminal
 */
function pad(level: string) {
  return level.padEnd(5);
}

export function log(level: LogLevel, message: string) {
  const time = getTimestamp();

  console.log(
    `[${time}] [${pad(level)}] ${message}`
  );
}