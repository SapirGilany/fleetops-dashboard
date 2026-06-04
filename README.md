# FleetOps Simulation System

````md
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-enabled-blue)
![Architecture](https://img.shields.io/badge/architecture-event--driven-orange)
![State](https://img.shields.io/badge/state-in--memory-yellow)
````
---

## Overview

FleetOps is a real-time in-memory robotics simulation system that models autonomous fleet behavior, mission assignment, and lifecycle execution.

The system simulates:

- 100+ autonomous robots
- Continuous mission generation
- Real-time state transitions per robot
- Pending queue handling
- Mission cancellation and recovery flows

It runs entirely in Node.js using timers and in-memory state without persistence.

---

## Project Structure

The project is split into two main parts:

- backend (Node.js + TypeScript simulation engine)
- frontend (React dashboard UI)

### Backend Structure

```bash
src/
- config/        # Simulation configuration (fleet size, timings)
- controllers/   # HTTP route handlers
- services/      # Core simulation logic (robots, missions, lifecycle)
- routes/        # API route definitions
- data/          # In-memory stores (robots, missions, queues)
- types/         # TypeScript interfaces
- utils/         # Logger and helpers
- bootstrap.ts   # System initialization
````

### Frontend Structure

```bash
src/
- api/           # API clients for backend communication
- components/    # UI components (tables, cards, etc.)
- types/         # TypeScript interfaces
- App.tsx        # Main dashboard logic
````

---

## Setup Instructions

### Requirements

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
````

### Run Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3001
```

---

## API Endpoints

### Simulation

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | `/simulation/start` | Starts mission generation |
| POST   | `/simulation/reset` | Resets system state       |

### Data

| Method | Endpoint  | Description               |
| ------ | --------- | ------------------------- |
| GET    | `/robots` | Returns all robots        |
| GET    | `/system` | Returns system statistics |

### Robot Control

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/robots/:id`          | Returns a single robot by ID         |
| POST   | `/robots/:id/cancel`   | Cancels current mission for a robot  |

---

## System Architecture

```
Controllers → Services → In-Memory Store
```

Core services:

* SimulationService → mission orchestration
* RobotLifecycleService → robot state machine
* MissionService → mission creation
* RobotService → fleet initialization

---

## Simulation Logic

Each robot operates as an independent state machine with its own lifecycle timers and timestamps.

---

## Mission Lifecycle

```
IDLE → ASSIGNED → EN_ROUTE → DELIVERING → COMPLETED → IDLE
```

Transitions are time-based using randomized delays per state, defined in the simulation configuration.

### States

**IDLE**
Robot is available for assignment.

**ASSIGNED**
Mission is assigned to robot and lifecycle starts.

**EN_ROUTE**
Robot is traveling to destination (simulated delay).

**DELIVERING**
Robot is executing mission.

**COMPLETED**
Mission is finished successfully.

Robot then returns to IDLE.


## State Machine & Scheduling Flow

The system includes a hybrid model of:
- State machine per robot
- Global mission queue (pending missions)

```mermaid
flowchart TD

A[Mission Created] --> B{Is robot available?}

B -->|Yes| C[ASSIGNED to robot]
C --> D[EN_ROUTE]
D --> E[DELIVERING]
E --> F[COMPLETED]
F --> G[Robot becomes IDLE]

B -->|No| H[Pending Queue]
H --> I[Stored in pendingMissions]

G --> J{Pending missions exist?}
J -->|Yes| K[Assign next mission]
J -->|No| L[Robot stays IDLE]
K --> C
````
---

## Timing Model

Each state transition uses:

* Randomized durations per stage
* Config-based timing ranges
* `Date.now()` timestamps per state

This simulates real-world asynchronous behavior.

---

## Mission Assignment Flow

```
Mission Generated
      │
      ▼
Check available robots
      │
      ├── Available → assign immediately
      └── None → push to pending queue
```

---

## Pending Queue

* FIFO queue
* Stores unassigned missions
* Automatically consumed when robot becomes available

---

## Cancellation Flow

```
Active Mission
      │
      ▼
Cancel triggered
      │
      ▼
Robot → IDLE
      │
      ▼
Robot becomes available
      │
      ▼
Pending queue checked automatically
```

---

## System State Model

Each robot contains:

* status
* startedAt
* durationMs
* missionId

---

## System Statistics

* totalRobots
* availableRobots
* activeMissions
* pendingMissions
* completedMissions
* cancelledMissions
* totalMissions

---

## Design Decisions

### In-Memory Architecture

All system state is stored in memory for simplicity and speed.

Tradeoff: no persistence across restarts.

---

### Event-Driven Simulation

The system uses:

* `setInterval` for mission generation
* `setTimeout` for lifecycle transitions

---

### Single Source of Truth

All missions are created via `MissionService` to ensure consistency.

---

## Scalability Considerations

Current limitations:

* In-memory only
* Single-process execution
* No persistence layer
* No distributed workers

Suitable for:

* simulations
* dashboards
* demos
* educational systems

---

## Frontend Dashboard

The frontend provides a real-time control panel for the simulation.

### Main Features

- Start / Reset simulation controls
- Fleet size selector (5 / 10 / 20 / 50 / 80 / 100 robots)
- Live system statistics:
  - Total / Active / Pending / Cancelled / Completed missions
  - Available vs Busy robots
- Robot table with real-time updates
- Status filtering (idle, en_route, delivering, etc.)

### Dashboard Preview

![FleetOps Dashboard](./docs/dashboard.png)

### UI Design Philosophy

The UI is designed to reflect the backend simulation state in real time.
It acts as a live visualization layer over an event-driven backend system.

The dashboard separates:

- System controls (start/reset)
- High-level metrics (system state, robots, fleet size selection, missions)
- Detailed robot-level inspection (filterable table)

---


## Future Improvements

* WebSocket real-time updates
* Persistent database for missions
* Explicit mission state field
* Distributed worker architecture
* Retry/failure handling

