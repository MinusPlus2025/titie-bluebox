# HANDOFF

## Read first

1. `AGENTS.md`
2. `docs/team/TEAM_SYNC.md`
3. `docs/team/TASK_BOARD.md`
4. `docs/team/DECISION_LOG.md`
5. `docs/official/PROJECT_BRIEF.md`

## Current state

The project root is `/Users/ming/Documents/ChatGPT/体贴/`. Phase 1, Phase 2, the Phase 3 BlueBox V2 browser Demo, and the thin production API layer are verified. Current baseline: 61 tests plus passing typecheck/build.

## Stable public paths

- Domain types: `src/domain/`
- Thermal engine: `src/engine/`
- Sensor quality: `src/sensors/`
- Control command mapping: `src/control/`
- Validation dataset and runner: `src/validation/`
- Existing semantic Body View: `src/ui/body-view.tsx`
- Browser experience composition: `src/app/demo-experience.ts`
- Seven-screen React UI: `src/app/`
- Browser entry: `index.html`, `src/main.tsx`, `vite.config.ts`
- Production API services: `src/api/services.ts`
- Vercel Functions: `api/health.ts`, `api/evaluate.ts`, `api/feedback.ts`, `api/validate.ts`
- Deployment routing: `vercel.json`
- Active brand source: `docs/brand/TITIE_BRAND_SYSTEM_V2.md`
- Active UI/copy source: `docs/ui/TITIE_UI_UX_BLUEBOX_V2.md`, `docs/ui/COPY_DECK_BLUEBOX_V2.md`
- Archived source prototype: `docs/ui/bluebox-v2/prototype/`

## Run and inspect

```bash
npm run dev
```

BlueBox V2 desktop and mobile captures are in `docs/submission/screenshots/bluebox-v2/`. The next bounded task is product-owner review; real-hardware or field-validation work must retain the explicit simulated-evidence boundary.

## Guardrails

- Keep human-facing labels to `暖一点 / 刚刚好 / 凉一点`.
- Do not expose WARM/HOLD/COOL on primary screens.
- Do not imply real sensors, real actuators, clinical evidence, or field validation.
- Do not add unrelated sleep-dashboard features.
- Run `npm test`, `npm run typecheck`, and `npm run build` before handoff.
