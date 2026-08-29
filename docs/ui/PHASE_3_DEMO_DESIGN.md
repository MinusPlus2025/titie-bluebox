# Phase 3 Browser Demo Design

## Outcome

A seven-screen, single-page browser demonstration that lets a judge move from tonight's context to body-zone decisions, inspect real engine explanations and simulated actuator commands, see a restrained night timeline, submit morning feedback, rerun a similar episode, and compare the three validation strategies.

## Architecture

The React app contains no thermal rules. `src/app/demo-experience.ts` is the only UI adapter and composes existing exports from `src/scenarios`, `src/engine`, `src/control`, `src/sensors`, and `src/validation`. React components consume a presentation model containing Chinese user labels, engine reasons, real `ThermalControlCommand` values, before/after personalization decisions, and validation reports.

Feedback is session-local prototype state. Submitting feedback appends a real `ThermalFeedback` feature vector and reruns the existing `decideForZone` path. No claim is made that the data came from a person or physical sensor.

## Screen flow

1. **今晚** — one calm starting scene with environment, user, scenario, and `看看今晚的状态`.
2. **身体** — the dominant surface. A central authored SVG body outline carries six selectable zones. Each zone displays only `暖一点 / 刚刚好 / 凉一点`.
3. **为什么** — one selected zone, a cautious headline, and reasons sourced from the engine plus explicit whole-room/local-control context.
4. **体贴正在做什么** — human phrasing first; capability-aware `ThermalControlCommand` details live in an expandable disclosure.
5. **一晚时间线** — signal, judgment, adjustment, HOLD, reevaluation. The quiet HOLD interval occupies the most visual time.
6. **早晨** — body zone selection and three feedback controls. Submission reruns a similar episode through existing personalization and shows before/after output.
7. **为什么这样做更合理** — direct `runPhase2Validation()` results, metric definitions, and the mandatory non-clinical disclaimer.

## Visual direction: Night Linen Atlas

The chosen grounded direction is a moonlit bed-linen body atlas: an off-white textile field, deep green-black type, pale sage structure, warm amber for `暖一点`, muted mineral blue for `凉一点`, and undyed linen for `刚刚好`. Color is never the only state signal.

The body is a continuous contour, not a heat map. Zone status is expressed through restrained stitched bands, text labels, and small directional marks. The main interaction is selecting a zone directly on the body; the selected contour gently settles into focus while the explanation changes beside it.

Typography uses a humanist UI sans stack with Chinese system fallbacks. Layout is a quiet editorial split rather than a dashboard grid. Buttons, disclosures, focus rings, selection, reduced motion, empty states, and invalid-sensor HOLD all share one vocabulary.

### Direction raises from declined challengers

- **Type specimen discipline:** large/small scale contrast is reserved for body-state hierarchy, not decorative display text.
- **Night instrument discipline:** each region owns one truth and all states remain cross-checkable, without adopting gauges, black panels, or HUD styling.
- **Monochrome proof discipline:** every product claim is immediately paired with real engine, command, or validation evidence.
- **Star atlas discipline:** the body has a stable coordinate topology, without celestial decoration or dense data plotting.
- **Cloud-edge discipline:** active color stays narrow and peripheral; the surface remains largely neutral.
- **Tensegrity discipline:** signal → decision → command relationships remain visibly connected, without engineering-diagram aesthetics.

## Responsive behavior

Desktop uses a narrow persistent progress rail and a wide content stage. Mobile replaces the rail with a compact top progress strip; body and explanation stack, engineering tables scroll horizontally, and all zone controls remain at least 44px high.

## Error and safety states

`INVALID` sensor quality produces `刚刚好`, no aggressive actuator language, level 0, and a clear explanation that the system is waiting for reliable data. Missing decisions use the existing quiet observation state. Technical failures never fabricate fallback recommendations.

## Testing

Six new integration behaviors exercise real modules: Body View decisions, explanations, commands, feedback rerun, validation data, and invalid-sensor HOLD. Existing 40 tests remain unchanged and green. Browser verification covers desktop and mobile screenshots, keyboard focus, navigation, feedback rerun, disclosure, and absence of user-facing WARM/HOLD/COOL.
