type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

function getTimestamp() {
  return new Date().toISOString();
}

function pad(level: string) {
  return level.padEnd(5);
}

/**
 * ANSI colors (works in Node terminal)
 */
const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

/**
 * Color per log level
 */
function getColor(level: LogLevel) {
  switch (level) {
    case "INFO":
      return colors.green;
    case "WARN":
      return colors.yellow;
    case "ERROR":
      return colors.red;
    case "DEBUG":
      return colors.blue;
    default:
      return colors.reset;
  }
}

/**
 * Main logger (same API as before!)
 */
export function log(level: LogLevel, message: string) {
  const time = getTimestamp();
  const color = getColor(level);

  console.log(
    `${colors.gray}[${time}]${colors.reset} ${color}[${pad(level)}]${colors.reset} ${message}`
  );
}