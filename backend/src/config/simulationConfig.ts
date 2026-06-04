export const simulationConfig = {
  missionGeneration: {
    // Generates a small batch of missions every minute,
    // matching the assignment requirements.
    // For local testing, this interval can be reduced
    // to speed up observation of the simulation.
    intervalMs: 60_000,

    // Number of new missions created per generation cycle.
    batchSize: 2,
  },

  fleet: {
    // Default fleet size used when the system boots.
    size: 100,

    // Available fleet sizes exposed in the UI.
    fleetOptions: [5, 10, 20, 50, 80, 100],
  },

  robotTimings: {
    assigned: {
      // Represents mission acknowledgement and preparation.
      // Kept short to quickly move robots into active work.
      minMs: 3_000,
      maxMs: 6_000,
    },

    enRoute: {
      // Longest phase of the lifecycle.
      // Simulates travel time to destination.
      minMs: 65_000,
      maxMs: 75_000,
    },

    delivering: {
      // Represents the actual delivery operation.
      // Shorter than travel time but still visible in the UI.
      minMs: 5_000,
      maxMs: 10_000,
    },

    completed: {
      // Brief completion state before returning to idle.
      // Allows users to observe successful deliveries.
      fixedMs: 2_000,
    },
  },
};