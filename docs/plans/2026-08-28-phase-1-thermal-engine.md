# Phase 1 Thermal Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic, explainable six-zone thermal preference core whose fixed prototype scenarios prove personalization, local differences, confidence gating, hysteresis, and safety limits.

**Architecture:** Use a small TypeScript domain core with no UI or infrastructure dependencies. Immutable sensor windows flow through a feature extractor into a pure decision engine; personal feedback is converted into an explicit calibration bias, and a control policy gates unsafe or unstable actions. Fixed scenarios are deterministic fixtures that exercise the public `decideForZone` and `decideForBody` contracts end to end.

**Tech Stack:** TypeScript, Node.js, Vitest

**Spec:** `docs/official/PROJECT_BRIEF.md`, with language and validation constraints from the classified project documents under `docs/`.

## Global Constraints

- Do not use an LLM to decide whether a user is cold or hot.
- User-facing labels are exactly `暖一点 / 刚刚好 / 凉一点`; backend actions are `WARM / HOLD / COOL`.
- `HOLD` is a first-class intelligent action.
- Optional cycle, hot-flash, exercise, or life-stage context must never become a deterministic thermal rule.
- All fixtures and outputs are labeled `Prototype Simulation`; they are not clinical or field validation.
- Every action path is deterministic, explainable, and bounded by confidence, hysteresis, minimum intervention interval, maximum intensity, and maximum duration.

---

### Task 1: Domain contracts and feature extraction

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/domain/thermal.ts`
- Create: `src/engine/feature-extractor.ts`
- Test: `tests/feature-extractor.test.ts`

**Interfaces:**
- Consumes: timestamped per-zone `ZoneSensorSample[]`.
- Produces: `extractZoneFeatures(window): ZoneFeatures`, including current values, slopes, body delta, and sample count.

- [ ] **Step 1: Write failing tests** for literal two-sample slopes, latest readings, body delta, and malformed windows.
- [ ] **Step 2: Run `npm test -- tests/feature-extractor.test.ts`** and confirm failure because the module does not exist.
- [ ] **Step 3: Add the minimal TypeScript contracts and feature extractor** using elapsed minutes rather than sample-count assumptions.
- [ ] **Step 4: Re-run the focused test** and confirm all assertions pass.

### Task 2: Deterministic Sensor Simulator

**Files:**
- Create: `src/simulator/sensor-simulator.ts`
- Test: `tests/sensor-simulator.test.ts`

**Interfaces:**
- Consumes: `SimulationScenario` with seed, start time, interval, initial zone values, and per-minute changes.
- Produces: `simulateSensorWindow(scenario): ZoneSensorWindow`, always marked `simulation: true` and `evidenceLabel: "Prototype Simulation"`.

- [ ] **Step 1: Write failing tests** proving identical inputs return identical windows, trends are numerically correct, and every generated sample carries the simulation boundary.
- [ ] **Step 2: Run `npm test -- tests/sensor-simulator.test.ts`** and confirm the missing-module failure.
- [ ] **Step 3: Implement a seeded, pure simulator** with bounded deterministic jitter and no wall-clock reads.
- [ ] **Step 4: Re-run simulator and feature tests** and confirm both pass.

### Task 3: Personal calibration and thermal preference engine

**Files:**
- Create: `src/engine/personal-calibration.ts`
- Create: `src/engine/control-policy.ts`
- Create: `src/engine/thermal-preference-engine.ts`
- Test: `tests/thermal-preference-engine.test.ts`

**Interfaces:**
- Consumes: `decideForZone(profile, zoneSensorWindow, context, history)` and `decideForBody(profile, bodySensorWindows, context, history)`.
- Produces: `ZoneDecision` with action, Chinese user label, intensity `0..3`, duration, confidence, reason codes/messages, reevaluation time, and simulation label.

- [ ] **Step 1: Write failing behavior tests** for cold/warm evidence, personal feedback shifting a later decision, low confidence forcing HOLD, minimum interval preventing reversal, hysteresis preventing a weak reversal, and safety caps.
- [ ] **Step 2: Run `npm test -- tests/thermal-preference-engine.test.ts`** and confirm expected missing-behavior failures.
- [ ] **Step 3: Implement minimal score aggregation and explicit policy gates**; context may adjust confidence only when backed by personal history and must never directly choose a direction.
- [ ] **Step 4: Re-run all unit tests**, refactor names and duplicated setup only while green.

### Task 4: Fixed Demo scenario acceptance suite

**Files:**
- Create: `src/scenarios/demo-scenarios.ts`
- Test: `tests/demo-scenarios.test.ts`
- Create: `README.md`

**Interfaces:**
- Consumes: scenario fixtures mapped directly from `docs/demo/DEMO_SCENARIOS.md`.
- Produces: stable scenario results through the real simulator, extractor, calibration, engine, and control policy.

- [ ] **Step 1: Write failing acceptance tests** for same temperature/different people, opposite simultaneous zone actions, different nights for one person, low-confidence HOLD, and post-WARM anti-oscillation.
- [ ] **Step 2: Run `npm test -- tests/demo-scenarios.test.ts`** and confirm the suite fails because fixtures are absent.
- [ ] **Step 3: Add only the fixtures and scenario runner needed by those tests**, preserving the `Prototype Simulation` label.
- [ ] **Step 4: Run `npm test`, `npm run typecheck`, and `npm run build`** and record exact results.
- [ ] **Step 5: Document architecture and real-vs-simulated boundaries** in `README.md`, without claims of clinical accuracy or real actuator validation.

## Self-review

- Coverage: all Phase 1 priorities requested by the user and all mandatory behavioral tests in `VALIDATION_PLAN.md` are mapped above.
- Deliberately deferred: UI, Digital Twin rendering, strategy-comparison metrics, and persistent feedback storage; the domain command shape needed by the future twin is included now.
- Type consistency: all modules exchange domain types from `src/domain/thermal.ts`; only the engine exports decision entry points.
