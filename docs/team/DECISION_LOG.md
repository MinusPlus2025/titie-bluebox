# DECISION LOG

## 2026-08-30 — Internal evidence is not user-interface content

Decision: users see the thermal result, natural-language reasons, the current action, data availability, and when the product will look again. They do not see confidence percentages, raw sensor enums, feature slopes, zone deltas, similar-episode counts, Engine actions, ControlCommand fields, raw reason codes, API wording, or algorithm names.

Validation boundary: the public comparison page may show the three strategy outcomes and a clearly labeled demonstration scope, but not a live internal decision dump. The underlying Validation Runner output remains unchanged and tested.

Truth boundary: simulation disclosure remains mandatory, but ordinary pages phrase it as `演示数据`, `演示版本`, or `体验模式`. This keeps the product honest without asking users to understand development terminology.

Implementation boundary: no changes were made to Thermal Engine, Sensor Quality, Similar Episode Personalization, Control Contract, Validation Runner, or API decision behavior.

## 2026-08-30 — Make evidence scope and failure truth visible

Decision: ordinary product surfaces describe Engine outputs as desired adjustments (`想暖一点 / 刚刚好 / 想凉一点`) and always disclose the simulated monitoring boundary. Technical Validation shows the fixed synthetic sample count, numerator/denominator, and percentage-point gain instead of presenting percentages without scope.

Safety and trust rule: DEGRADED contact remains a calm HOLD state, while failed feedback submission must remain an error/retry state and must never be presented as learned personalization.

Accessibility rule: primary interactive surfaces use native controls and dialog/tab semantics, visible focus, Escape close, and reduced-motion support. The approved Eazo visual composition remains unchanged.

Implementation boundary: no changes were made to the frozen Thermal Engine, Sensor Quality, Control Contract, Similar Episode Personalization, Validation Runner, or `/api/evaluate` decision logic.

## 2026-08-30 — Use night-based Chinese on ordinary product surfaces

Decision: describe sleep history with dates, nights, and direct events rather than treating “觉” as a counter or repeatedly saying “这一觉”. Ordinary surfaces use concise Chinese such as “夜间记录”, “冷暖调节”, “最近一周”, and “参考过的相似状态”.

Boundary: backend field names and technical terms remain unchanged. Raw enums and engineering identifiers stay in Technical Details and `/validation`; ordinary pages translate the same underlying results without hiding the Prototype Simulation boundary.

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
