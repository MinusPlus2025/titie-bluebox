# AGENTS.md — 体贴 / SheNicest × 蓝盒子

## Project identity
- Product: 体贴
- Challenge: SheNicest 2026 × 蓝盒子「做一款智能调节冷暖的睡眠产品」
- Track: 软件
- Product category: 个体化身体温感与分区调节系统
- Core promise: 不替用户设定一个“标准温度”，而是根据身体不同区域的变化、睡眠环境与用户自己的反馈，逐渐学会哪里需要暖一点、凉一点，什么时候保持刚刚好。

## Source of truth
Read these before implementation:
1. `docs/brand/TITIE_BRAND_SYSTEM_V2.md`
2. `docs/ui/TITIE_UI_UX_BLUEBOX_V2.md`
3. `docs/ui/COPY_DECK_BLUEBOX_V2.md`
4. `docs/ui/bluebox-v2/prototype/`
5. `docs/official/PROJECT_BRIEF.md`
6. `docs/product/PRODUCT_LANGUAGE.md`
7. `docs/research/RESEARCH_BASIS.md`
8. `docs/validation/VALIDATION_PLAN.md`
9. `docs/demo/DEMO_SCENARIOS.md`
10. `docs/team/TEAM_SYNC.md`
11. `docs/team/TASK_BOARD.md`
12. `docs/team/DECISION_LOG.md`
13. `docs/team/HANDOFF.md`

## Team synchronization
- 每完成一个 Phase 或重大任务，必须同步更新 `docs/team/` 中的项目状态、已完成成果、当前风险和下一任务。
- 所有团队角色与后续 Codex session 都必须先阅读这些文件。
- Phase 1 和 Phase 2 的核心 Engine、Validation Runner、Digital Twin Control Contract、Sensor Quality 与 Similar Episode Personalization 已进入功能冻结；除非发现 bug 或明确命题缺口，不增加核心算法复杂度。

## Non-negotiables
- Do not redesign the product into a generic sleep dashboard, AI chatbot, sleep score, music player, alarm, or health diagnosis tool.
- Do not use an LLM to decide whether the user is cold/hot.
- User-facing controls use: `暖一点 / 刚刚好 / 凉一点`.
- Backend may use: `WARM / HOLD / COOL`.
- Predict thermal preference/action, not a universal “best temperature”.
- Cycle, hot-flash/perimenopause, exercise or life-stage context is optional context, never a deterministic rule.
- Never encode rules such as `经期 => 腹部加热`.
- Never claim simulated sensor data, actuator behavior, or synthetic validation as real clinical/field evidence.
- All demo data must be labeled `Prototype Simulation`.
- The algorithm must be explainable and testable.
- `HOLD`/`刚刚好` is a first-class intelligent action.
- Add hysteresis, confidence threshold, minimum intervention interval, and safety caps.
- Same room temperature must be able to produce different decisions for different people.
- The same person at the same time must be able to need different actions in different body zones.
- Personal feedback must be able to alter subsequent decisions.

## Engineering priorities
1. Data schema
2. Deterministic sensor simulator
3. Thermal preference engine
4. Personal calibration
5. Control command generator
6. Automated scenario tests
7. Body-state UI
8. Digital mattress twin
9. Feedback UI
10. Validation UI
11. Visual polish

## Recommended stack
- Next.js + TypeScript + Tailwind
- Single repository
- Local/static demo data initially
- localStorage or lightweight local persistence for feedback
- No auth/payment/cloud DB unless core MVP is already complete

## Required verification
Before declaring a phase complete:
- run unit tests
- run scenario tests
- run build/typecheck
- report exact commands and results
- report what is real vs simulated
