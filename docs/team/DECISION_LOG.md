# DECISION LOG

## 2026-08-30 — Separate human reasoning from engineering evidence

Decision: keep the existing Bottom Sheet and visual composition, but divide RegionSheet evidence into three progressive layers: human decision/action, dynamic natural-language reasons derived from the real Engine result, and a nested technical detail disclosure. Raw Engine action, ControlCommand, Sensor Quality enums, and reason codes belong only on Technical Validation.

Reason: judges and users need a complete explanation without engineering labels overwhelming the primary thermal experience. This preserves a single Engine while making HOLD visibly intentional and making technical evidence available in the correct context.

Implementation boundary: `/api/evaluate`, the thermal Engine, Sensor Quality, Control Contract, Similar Episode Personalization, and Validation Runner remain unchanged. The update is strictly a presentation adapter and regression-test change.

## 2026-08-29 — Final interaction layer remains a thin adapter

Decision: complete visible interaction responses in the Eazo React layer while continuing to derive thermal decisions, reasons, sensor safety behavior, actuator commands, feedback episodes, and validation metrics from the frozen Phase 1/2 modules.

Reason: the final product must demonstrate a complete personal thermal-decision loop without creating a second Engine or expanding into a general sleep dashboard.

Persistence boundary: lightweight profile settings use localStorage and newly accepted feedback is retained for the running demo session. This is explicit prototype persistence, not an account system or production database.

Visual correction: the product-review screenshots override the prior hotspot coordinate. The shoulder marker now targets the visible shoulder blade, while blue/orange state accents retain text labels and use restrained halos rather than medical heat-map colors.

## 2026-08-29 — Thin production API adapters preserve the frozen core

Decision: expose health, evaluation, feedback, and validation as Vercel Functions that import the existing Engine, Sensor Quality, Personalization, and Validation Runner modules directly.

Reason: the final full-stack release requires real HTTP boundaries, while the frozen Phase 1/2 business logic must remain the single source of truth. API handlers perform only method handling, request-shape validation, and response serialization.

Safety contract: DEGRADED and INVALID inputs stop at the Engine boundary and return HOLD with intensity 0, regardless of the thermal evidence direction. All generated evidence remains labeled Prototype Simulation.

## 2026-08-29 — BlueBox Brand UI/UX V2 becomes visual source of truth

Decision: `TITIE_BRAND_SYSTEM_V2.md`, `TITIE_UI_UX_BLUEBOX_V2.md`, `COPY_DECK_BLUEBOX_V2.md`, and their prototype supersede the earlier Reference V1 visual system.

Reason: This delivery formally connects 体贴 to the BlueBox parent-brand blue system while preserving the approved product flow and language hierarchy.

Implementation boundary: prototype structure, tokens, logo, and copy are migrated into the current React/Vite presentation layer. Static prototype values do not replace outputs from Engine, Validation, Personalization, Sensor Quality, or Control Contract.

## 2026-08-28 — Freeze the Phase 1/2 core

Decision: Treat Engine, Validation Runner, control contract, sensor quality, and similar-episode personalization as functionally frozen.

Reason: Phase 3 is about product experience, evidence visibility, and demo readiness. Additional algorithm complexity would increase risk without improving the current challenge story.

Revisit only if: a reproducible bug appears or an explicit SheNicest / Blue Box requirement cannot be demonstrated with the current interfaces.

## 2026-08-28 — One source of business truth

Decision: Browser UI adapters call modules under `src/domain`, `src/engine`, `src/control`, `src/sensors`, and `src/validation`. No frontend-local WARM/HOLD/COOL rules are allowed.

Reason: The demo must demonstrate the tested product core rather than a scripted visual imitation.

## 2026-08-28 — Evidence language

Decision: Every generated observation, actuator command, comparison metric, and feedback rerun remains labeled `Prototype Simulation`.

Reason: Current evidence validates software behavior only, not human comfort, clinical outcomes, field effectiveness, or physical actuator performance.

## 2026-08-28 — Minimal browser shell

Decision: Use React + Vite as a thin browser shell and compose all seven screens from `src/app/demo-experience.ts`.

Reason: This preserves the existing TypeScript import graph and keeps the tested domain core as the single source of truth while adding the smallest practical browser runtime.

## 2026-08-28 — Night Linen Atlas visual direction

Decision: Use an off-white textile ground, deep green ink, restrained amber/mineral-blue state accents, editorial typography, and a central non-medical body contour. Avoid gradients, HUD language, dashboard density, pink stereotypes, and diagnostic heatmaps.

Reason: The product must feel quiet, exact, human, and sleep-oriented while keeping state legible without letting engineering information dominate.
