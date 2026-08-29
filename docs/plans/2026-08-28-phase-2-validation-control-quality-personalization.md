# Phase 2 Validation, Control, Quality, and Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete a comparable synthetic validation runner, capability-aware Digital Twin control contract, conservative sensor-quality degradation, explainable similar-episode learning, and only then a non-polished Body View skeleton.

**Architecture:** Keep the thermal engine pure. Sensor quality is assessed before evidence scoring, episode retrieval supplies capped personal evidence, control command generation applies actuator capabilities after preference decisions, and validation runs all strategies against the same immutable dataset and synthetic ground truth.

**Tech Stack:** TypeScript, Vitest; React only for the final semantic Body View skeleton.

**Spec:** `docs/official/PROJECT_BRIEF.md`, `docs/validation/VALIDATION_PLAN.md`, and the Phase 2 user requirements dated 2026-08-28.

## Global Constraints

- All generated data, ground truth, metrics, commands, and UI demo content are labeled `Prototype Simulation`.
- `HOLD` remains a first-class action; worsening data quality must never increase intervention intensity or confidence.
- All three validation strategies consume the exact same scenario observations and synthetic preference labels.
- Optional body context never directly selects WARM or COOL.
- Similar-episode learning is deterministic, explainable, Top-K bounded, minimum-sample gated, and confidence capped.
- Body View work starts only after P0-A through P0-D pass tests, typecheck, and build; no visual refinement in this phase.

---

### Task 1: Sensor Quality Gate

**Files:** `src/domain/thermal.ts`, `src/sensors/sensor-quality.ts`, `src/engine/feature-extractor.ts`, `src/engine/thermal-preference-engine.ts`, `tests/sensor-quality.test.ts`

**Interfaces:** Produces `SensorQualityAssessment { status, confidenceMultiplier, issues, lastValidTimestamp, safeToIntervene }`; `decideForZone` consumes it before action selection.

- [ ] Write failing tests for missing signal, spike, stale data, and lost contact, each asserting non-increasing confidence and HOLD/safe stop for critical invalidity.
- [ ] Run the focused test and confirm expected missing-contract failure.
- [ ] Add optional sensor readings, explicit quality metadata, deterministic quality rules, and the engine confidence gate.
- [ ] Run focused and regression tests until green.

### Task 2: Similar Episode Personalization

**Files:** `src/domain/thermal.ts`, `src/engine/personal-calibration.ts`, `tests/similar-episode-personalization.test.ts`

**Interfaces:** Feedback stores a `PersonalizationFeatureVector`; calibration ranks same-user/same-zone episodes by normalized weighted distance and returns capped evidence plus matched episode explanations.

- [ ] Write failing tests proving similar feedback shifts the action, dissimilar history has little effect, conflicts reduce confidence, and one episode cannot cause overconfidence.
- [ ] Verify RED against the old zone-wide aggregation.
- [ ] Implement deterministic Top-K retrieval, minimum sample count, distance threshold, conflict penalty, and personal confidence cap.
- [ ] Run focused and all existing engine tests; refactor only while green.

### Task 3: Capability-aware Digital Twin Contract

**Files:** `src/domain/control.ts`, `src/control/control-command-generator.ts`, `tests/control-command-contract.test.ts`

**Interfaces:** `generateThermalControlCommand(decision, capability)` produces a standard command with zone, `HEAT | COOL | HOLD`, bounded level/duration, reevaluation, confidence, reason codes, and simulation marker.

- [ ] Write failing contract tests for supported actions, unsupported zone/direction, and actuator intensity/duration caps.
- [ ] Verify RED because the control contract module is absent.
- [ ] Implement command mapping and conservative HOLD fallback with explicit reason codes.
- [ ] Run focused and regression tests until green.

### Task 4: Shared-dataset Validation Runner

**Files:** `src/validation/types.ts`, `src/validation/strategies.ts`, `src/validation/scenario-dataset.ts`, `src/validation/validation-runner.ts`, `tests/validation-runner.test.ts`

**Interfaces:** Three independent `ValidationStrategy` implementations consume each identical `ValidationObservation`; `runValidation` returns per-strategy counts/rates and TITIE personalization gain.

- [ ] Write failing tests that identify the same dataset object/version at every strategy call and hand-check all five metric formulas on a small fixture.
- [ ] Verify RED because the runner is absent.
- [ ] Implement whole-bed fixed control, fixed-zone thresholds, TITIE adapter, and transparent metric calculations.
- [ ] Add a fixed synthetic dataset with repeated users/episodes and run all validation tests.

### Task 5: Core Gate and Body View Skeleton

**Files:** `package.json`, `src/ui/body-view.tsx`, `tests/body-view.test.tsx`, `README.md`, `docs/architecture/ARCHITECTURE_CHECK.md`

**Interfaces:** A semantic six-zone view consumes `ZoneDecision[]` and renders labels, confidence, reasons, and the simulation boundary without decorative design work.

- [ ] Run `npm test`, `npm run typecheck`, and `npm run build`; proceed only if all P0 modules pass.
- [ ] Load the applicable UI skills and write a failing semantic rendering test.
- [ ] Implement the minimal accessible Body View skeleton with no visual polish.
- [ ] Run full tests, typecheck, and build; update architecture and simulation-boundary documentation.

## Self-review

- The plan maps every requested metric, control field, sensor fault, and personalization behavior to a focused test.
- Validation ground truth is explicitly synthetic and independent from strategy outputs.
- UI is downstream of the core gate and is intentionally limited to semantic structure.
