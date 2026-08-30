# TEAM SYNC

Last updated: 2026-08-30
Current phase: Final Release — expert safety, evidence, and accessibility hardening complete

## Verified baseline

- Phase 1: 20 tests passed.
- Phase 2: 40 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Validation Runner: completed.
- Digital Twin Control Contract: completed.
- Sensor Quality degradation: completed.
- Similar Episode Personalization: completed.
- Phase 3: seven-screen browser Demo completed.
- Phase 3 verification baseline: 55 tests passed; `npm run typecheck` and `npm run build` passed.
- Desktop and mobile browser checks: 7 sections, no horizontal overflow, no console warnings/errors.
- Phase 3 Final UI: 8-screen product flow implemented from the approved Product Flow V1.
- Final UI verification baseline: 55 tests passed; `npm run typecheck` and `npm run build` passed.
- 1440px and 390px browser checks: 8 sections, no page-level horizontal overflow, no console warnings/errors.

## Functional freeze

The Phase 1/2 domain core is frozen. Do not increase algorithm complexity unless a bug or a concrete challenge-coverage gap is demonstrated.

## Real and simulated boundary

Real software implementation:

- deterministic sensor simulation and feature extraction;
- thermal preference decisions and explanations;
- sensor-quality degradation and safe HOLD;
- similar-episode feedback retrieval;
- actuator capability mapping and control commands;
- three-strategy validation metrics and automated tests.

Simulated or not yet validated:

- all sensor observations and preference ground truth;
- user feedback episodes used in the demo;
- actuator execution and physical thermal effect;
- validation results, which are not clinical or field evidence;
- there is no real human-subject, hardware-loop, clinical, or field validation.

## Phase 3 delivered

- Tonight → Body → Zone Detail → 体贴正在做什么 → Night Timeline → Morning Feedback → Personalization → Validation flow.
- Body status, explanations, actuator commands, personalization rerun, and validation metrics all originate from existing tested modules.
- Engineering fields live in expandable details; primary surfaces use human language.
- Body automatically summarizes HOLD-majority state and identifies the zones that need attention.
- DEGRADED/INVALID behavior is presented as calm observation and safe non-intervention rather than an error alarm.
- Reference V1 UI reconstruction completed: top navigation only, 55/45 Tonight hero, abstract top-down bed/sleeper, same-page Zone Drawer, inline current adjustment and Night Timeline, Morning Feedback/Personalization, and strategy-first Validation.
- Final review screenshots: `docs/submission/screenshots/reference-v1/01-tonight.png` through `06-technical-validation.png`.
- Browser verification at 1440 × 1000 and 390 × 844 completed; all primary interactions passed and the console had no warnings/errors.
- Design QA report: `design-qa.md`, final result `passed`.
- BlueBox Brand UI/UX V2 migration completed. The V2 brand system, UI specification, copy deck, static prototype, and logo are now stored under `docs/brand/`, `docs/ui/`, and `public/assets/`.
- BlueBox V2 is the current visual source of truth; the Phase 1/2 domain core remains unchanged.
- BlueBox V2 verification baseline: 56 tests passed; `npm run typecheck` and `npm run build` passed.
- Browser checks passed at 1440 × 1000 and 390 × 844; real Engine, Control, Sensor Quality, Personalization, and Validation outputs remained connected, with no console warnings/errors.
- V2 browser evidence: `docs/submission/screenshots/bluebox-v2/`.
- Final full-stack release adapter: `/api/health`, `/api/evaluate`, `/api/feedback`, and `/api/validate` reuse the frozen domain modules.
- Production deep link `/validation` is configured and opens the existing Technical Validation surface.
- Final release baseline: 61 tests passed; `npm run typecheck` and `npm run build` passed.
- API contract tests confirm both DEGRADED and INVALID sensor inputs return HOLD with intensity 0.
- Eazo final frontend source is now the only user-visible frontend: dark-blue immersive sleep image, six-zone rail, region sheet, sleep history, feedback overlay, and exactly three bottom tabs.
- All frontend network traffic is centralized in `src/services/titieApi.js`; evaluate, feedback, health, and validation retain the existing serverless/domain contracts.
- The turn demo posts a real DEGRADED evaluation and requires HOLD, intensity 0, and duration 0; INVALID follows the same safe-stop boundary.
- Eazo merge verification baseline: 65 tests passed; `npm run typecheck` and `npm run build` passed. Browser check at 390 × 844 confirmed the Eazo composition, region sheet, three tabs, and calm turn/degraded state.
- GitHub `main` and the existing Vercel project `titie-bluebox` are published. Production alias: `https://titie-bluebox.vercel.app`.
- Production verification returned HTTP 200 for `/`, `/validation`, `/api/health`, `/api/evaluate`, `/api/feedback`, and `/api/validate`; the DEGRADED POST returned HOLD, intensity 0, duration 0.
- Final UI defect fix: the shoulder/back hotspot was moved from the chest/forearm area to the visible right shoulder–upper-back junction. Regression baseline is now 66 tests passed with typecheck/build passing.
- Brand/day-theme review: the supplied Blue Box artwork established `#1846B9` as the primary brand token. Night accents now use that blue; day mode now switches the canvas, photo treatment, rail, controls, sheets, and bottom navigation to a cold-white daytime system. The shoulder/back marker was moved again to the shoulder-blade/upper-back contour and its label now opens inward.
- Final interaction hardening: all six body zones open the shared RegionSheet and use live `/api/evaluate` output; HOLD is rendered as a neutral first-class action.
- Sleep history now switches among 8/27, 8/28, and 8/29; 日/周/月 render distinct session, seven-night, and 30-day content without introducing sleep scores or medical staging.
- Feedback can target all six zones and the selected zone is sent through `/api/feedback`; accepted feedback is retained as running-session similar-episode evidence for subsequent evaluations.
- All nine visible rows on the 我的 page open the existing sheet pattern; preferences persist in localStorage and device/privacy/about surfaces preserve the Prototype Simulation boundary.
- The local Vite runtime now exposes the same API service functions as production, eliminating presentation-only fallback during local demos.
- Final interaction regression baseline: 71 tests passed; `npm run typecheck` and `npm run build` passed.
- Production QA found and fixed a presentation-only Validation defect: rate objects are now rendered from their real `rate` field, strategy/metric labels are human-readable, and Personalization Gain is shown; the Validation Runner itself was unchanged.
- Visual correction from product review: the shoulder marker is calibrated to the visible shoulder-blade area; cool/warm markers use restrained blue/orange halos and translucent blue labels aligned with the supplied reference.
- Mobile layout defect fix: the temperature/humidity chips now use a compact, non-wrapping safe-area layout that stays within the viewport at both 390px and 320px; the shoulder marker moved right from 68% to 76% per product review.
- Product-review surface correction: the shoulder/back label now opens to the right of its hotspot so it no longer covers the face. Day-mode rail, environment chips, theme control, and monitoring pill now use restrained translucent cool-white surfaces; 390px and 320px browser checks show zero horizontal overflow.
- The product-review correction is published on `main` in commit `797f128` and is active at `https://titie-bluebox.vercel.app/`.
- Engine-evidence disclosure defect fixed across all six region sheets: the former 400px animated cap clipped the final evidence rows. The shared RegionSheet now uses an uncapped native disclosure inside a safe, touch-scrollable sheet body; all real Engine evidence, raw reason codes, and the Prototype Simulation badge can be reached. Regression baseline: 72 tests passed; typecheck/build passed.
- The complete evidence disclosure fix is published on `main` in commit `446f00e` and verified in Production at `https://titie-bluebox.vercel.app/` with nine rows, matching panel client/scroll heights, zero horizontal overflow, and no console errors.
- Final information-hierarchy optimization: every RegionSheet now separates the primary human decision, 2–4 dynamic natural-language reasons, and a weaker nested technical detail layer. GOOD/DEGRADED/INVALID and confidence values are translated for users; raw action, command, and reason codes no longer appear in the user sheet.
- Technical Validation now includes a live decision example from the existing `/api/evaluate` path with zone, Sensor Quality, confidence, Engine Action, ControlCommand, reevaluation, diagnostics, raw Reason Codes, and the Prototype Simulation boundary.
- Information-hierarchy regression baseline: 75 tests passed; `npm run typecheck` and `npm run build` passed. Local 390 × 844 browser checks covered HOLD/WARM/COOL disclosures and the Technical Validation evidence surface.
- The evidence-hierarchy release is published on `main` in commit `db82bcf` and active at `https://titie-bluebox.vercel.app/`. Production verification confirmed the human-first RegionSheet, live Technical Validation example, Prototype Simulation label, and zero browser console warnings/errors.
- Full-product Chinese copy review completed across 体贴, 好好睡, 睡后反馈, 我的, and all six RegionSheets. Unnatural sleep counters and phrases such as “这一觉”, “5觉”, and user-facing HOLD/Prototype/Digital Twin language were replaced with concise night-based Chinese; engineering terms remain limited to Technical Details and `/validation`.
- Chinese-copy regression baseline: 77 tests passed; `npm run typecheck` and `npm run build` passed. A 390 × 844 browser pass verified the three night summaries, week/month views, feedback confirmation, all nine My-page panels, six RegionSheets, and zero horizontal overflow. Production QA also exposed and fixed a RegionSheet loading-state crash before final release.
- “关于体贴” now uses the approved formal product introduction: it explains the regional thermal decision loop, avoids internal architecture/AI/medical claims, and places the prototype/simulation boundary only in the product-boundary and version information. The existing About Sheet visual structure is unchanged.
- Final copy-release regression baseline: 78 tests passed; `npm run typecheck`, `npm run build`, and `git diff --check` passed. Browser QA confirmed the complete About copy, no banned legacy phrases, no extra scrolling, and no horizontal overflow.
- The Chinese-copy/loading-fallback release and approved About introduction are published on `main` through commit `2217b81` and active at `https://titie-bluebox.vercel.app/`. Production checks confirmed the new About copy and a working shoulder RegionSheet immediately after page load.
- Sleep-engineering/product expert audit completed without changing the frozen Engine, Sensor Quality, Control Contract, Similar Episode Personalization, or Validation Runner.
- Ordinary thermal states now use preference language (`想暖一点 / 刚刚好 / 想凉一点`) instead of implying that simulated sensors directly know the user's subjective sensation.
- The Home monitoring control always states `原型模拟`; DEGRADED contact recovery is presented as a calm, readable safe HOLD state.
- Feedback confirmation is now transactional: a failed `/api/feedback` request shows a retry message and can no longer falsely claim `记住了`.
- Technical Validation now states the fixed evidence scope (`5个合成场景 · 30个区域判断`), displays numerator/denominator with rates, and reports Personalization Gain in percentage points.
- Native buttons, dialog semantics, Escape close, visible keyboard focus, and reduced-motion support were added to the primary product flow while preserving the approved visual composition.
- Expert-hardening regression baseline: 82 tests passed; `npm run typecheck` and `npm run build` passed. Mobile browser evidence is stored in `docs/submission/screenshots/expert-audit-2026-08-30/`.
- Expert-hardening release commit `0ad06f3` is published on `main` and active at `https://titie-bluebox.vercel.app/`; Production checks confirmed the new Home simulation label and fixed Validation scope/percentage-point display.

## Current risks and next task

- All observations, feedback, ground truth, and actuator behavior remain synthetic.
- No real hardware timing, thermal-response, comfort, or safety evidence exists yet.
- The fixed demo dataset is intentionally small and should not be generalized to population performance.
- Similar-episode feedback persistence in this static demo is session-scoped; there is no account or durable backend database.
- Current validation contains only 5 fixed synthetic scenarios / 30 zone decisions; the new UI makes this visible, but the dataset is still too small for population or field claims.
- Real-world readiness still requires sensor placement calibration, clock synchronization, contact-loss/gap analysis, hardware safety verification, and prospective human-subject testing.
- Marker placement is calibrated to the current supplied sleep image and would need remapping if the photography changes.
- Legacy V1 reference screenshots remain archived but no longer define the active visual system.
- Next: stop feature work and wait for product-owner review. Any subsequent change should be a confirmed release defect only.
