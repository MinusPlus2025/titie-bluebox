# Phase 3 Browser Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a browser-run seven-screen demonstration backed entirely by the frozen Phase 1/2 core.

**Architecture:** Add Vite as a thin React shell. A tested `demo-experience` adapter composes existing scenario, engine, control, sensor, personalization, and validation modules into one presentation model; components render that model and own only navigation and session feedback state.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, CSS

**Spec:** `docs/ui/PHASE_3_DEMO_DESIGN.md`

## Global Constraints

- Do not duplicate or expand the frozen thermal algorithm.
- Primary UI copy uses only `暖一点 / 刚刚好 / 凉一点`.
- Every sensor, actuator, feedback, and validation artifact remains `Prototype Simulation`.
- Invalid sensor quality can only render a safe HOLD presentation and level-0 command.
- Engineering values are progressive disclosure, never the main body state.

---

### Task 1: Browser shell and integration adapter

**Files:** Create `index.html`, `vite.config.ts`, `src/main.tsx`, `src/app/demo-experience.ts`; modify `package.json`, `tsconfig*.json`; test `tests/demo-experience.test.ts`.

**Interfaces:** `createDemoExperience()` returns tonight context, six real decisions, explanations, control commands, timeline, validation run, and feedback methods.

- [ ] Write six failing integration tests covering the exact Phase 3 evidence requirements.
- [ ] Run the focused test and confirm failure because the adapter is absent.
- [ ] Implement the minimum adapter by composing existing public modules; expose no new thermal rules.
- [ ] Run focused tests and the existing 40-test regression suite.

### Task 2: Seven-screen React experience

**Files:** Create `src/app/demo-app.tsx`, `src/app/screens.tsx`, `src/app/body-map.tsx`; modify `src/ui/body-view.tsx`; test `tests/demo-app.test.tsx`.

**Interfaces:** `DemoApp` owns current screen, selected zone, feedback choice, and feedback-result visibility while consuming `DemoExperience`.

- [ ] Write failing static-render tests for seven named screens, human labels, simulation boundary, and no primary WARM/HOLD/COOL text.
- [ ] Verify RED because app components do not exist.
- [ ] Implement semantic screen sections, zone controls, details disclosure, and feedback state.
- [ ] Run focused and full tests.

### Task 3: Night Linen Atlas visual system

**Files:** Create `src/app/styles.css`; modify `index.html`, `PRODUCT.md`; create `DESIGN.md` after the verified build.

**Interfaces:** CSS tokens and responsive layout style existing semantic components without changing their data or behavior.

- [ ] Implement the approved palette, typography, body-centered layout, component states, responsive structure, and reduced-motion handling.
- [ ] Run the Impeccable detector once and fix mechanical findings.
- [ ] Build and start the Vite demo; verify desktop and mobile in the browser.

### Task 4: Evidence capture and team handoff

**Files:** Create `.impeccable/review/desktop.png`, `.impeccable/review/mobile.png`; update `README.md`, `docs/ui/BODY_VIEW.md`, and all `docs/team/*.md`.

**Interfaces:** Documentation records the exact launch command, screen structure, evidence boundary, test results, risks, and next task.

- [ ] Run `npm test`, `npm run typecheck`, and `npm run build` fresh.
- [ ] Capture and inspect desktop/mobile screenshots.
- [ ] Record the shipped visual system and update team synchronization files.
