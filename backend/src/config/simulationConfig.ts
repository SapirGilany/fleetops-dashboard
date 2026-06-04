export const simulationConfig = {
  missionGeneration: {
    intervalMs: 5_000, // every 60 seconds
    batchSize: 2, // number of missions per cycle
  },

  fleet: {
    size: 100, // number of robots in the fleet
    fleetOptions: [5, 10, 20, 50, 80, 100],
  },

  robotTimings: {
    assigned: {
      minMs: 3_000,
      maxMs: 6_000,
    },

    enRoute: {
      minMs: 35_000,
      maxMs: 45_000,
    },

    delivering: {
      minMs: 5_000,
      maxMs: 10_000,
    },

    completed: {
      fixedMs: 2_000,
    },
  },
};