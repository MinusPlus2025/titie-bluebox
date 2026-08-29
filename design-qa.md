# Phase 3 Reference V1 Design QA

**Source visual truth**

- `docs/ui/TITIE_UI_REFERENCE_V1.png` (1536 × 1024 px)
- The current user specification overrides obsolete elements visible on the board, specifically the sidebar, old page hierarchy, and photographic/standing-body treatment.

**Rendered implementation**

- `docs/submission/screenshots/reference-v1/01-tonight.png` (1425 × 990 px browser capture)
- CSS viewport: 1440 × 1000; browser capture excludes a small browser gutter.
- Density normalization: source resized to 1440 × 960 and implementation to 1440 × 1000 for the combined comparison at `.impeccable/review/comparison.png`.
- State: Tonight, stable sensors, knee selected.

**Full-view comparison evidence**

The combined comparison verifies the reference hierarchy: light horizontal navigation, bed/body as the dominant left field, summary and localized adjustment on the right, neutral pearl/charcoal balance, thin rules, compact controls, and low-saturation semantic accents. The implementation intentionally omits the obsolete board sidebar and follows the locked three-tab IA. The reference photo is intentionally replaced by the user-authorized abstract SVG/CSS sleeping figure.

**Focused-region evidence**

- `02-tonight-zone-detail.png`: right Drawer, three-level natural-language evidence, real command timing, folded technical evidence.
- `03-sensor-degraded.png`: quiet non-intervention state without red/error styling.
- `04-morning-feedback.png` and `05-personalization.png`: same body component and real feedback rerun.
- `06-technical-validation.png`: strategy-first presentation and three primary metrics.
- `.impeccable/review/mobile.png`: 390 × 844 responsive pass.

**Required fidelity surfaces**

- Typography: PingFang/Noto Sans/system only; 48px maximum title; hierarchy and wrapping match the locked brief.
- Spacing/layout: 55/45 desktop hero, 1320px maximum width, broad neutral whitespace, single-column mobile fallback.
- Colors/tokens: pearl, charcoal, muted warm/cool and neutral green-gray; semantic states always include text.
- Image quality: vector body remains sharp at desktop/mobile. It is intentionally abstract and non-medical per the user specification.
- Copy/content: primary copy and labels follow the locked brief; engineering terms remain inside disclosure layers.

**Findings**

- No actionable P0/P1/P2 visual mismatch remains against the current locked specification.
- P3: the abstract sleeper is deliberately more geometric than the illustrative figure in the board and may be refined only after product-owner review.

**Interaction and runtime checks**

- Tested Tonight zone selection, Drawer open/close, DEGRADED toggle, Morning tab, feedback submission/personalization expansion, and Validation tab.
- Browser console warnings/errors: none.
- No page-level horizontal overflow was visible at 1440px or 390px.

**Comparison history**

- Initial implementation pass replaced the obsolete left rail/eight-page scroll layout with the locked top nav, 55/45 Tonight hero, same-page Drawer, and product-first validation. Post-fix evidence is the six screenshots above.

**Implementation checklist**

- [x] Locked IA and navigation
- [x] Abstract clickable six-zone sleeper
- [x] Real Engine/Control/Sensor/Personalization/Validation wiring
- [x] Desktop and mobile rendering
- [x] Required evidence screenshots

final result: passed

## Eazo final release addendum

Reference: `https://3000-ii7eqkedmnm19ueycesoe.e2b.app`

- The active frontend now preserves the Eazo dark-blue immersive canvas, original `sleep-figure.png`, six-zone rail, semantic markers, ambient chips, day toggle, monitoring pill, and exactly three bottom tabs.
- Region detail remains a bottom sheet; feedback remains an overlay; `/validation` remains a hidden route.
- Production at 390 × 844 uses live `/api/evaluate` results without an API fallback label.
- The turn state uses the real DEGRADED Engine path, calm HOLD language, and no medical/error styling.
- Old V1/BlueBox V2 UI remains archived but is not the active entry point.

Eazo final result: passed

## Final interaction and marker review addendum

- Product-review references: `codex-clipboard-fc47ad5e-b4cb-4e40-96e1-ecea162f4636.png` and `codex-clipboard-7cbfba30-4e24-4a25-ac30-0725b1ac76c5.png` supplied in the review thread.
- Shoulder hotspot moved from the upper arm to the visible shoulder-blade area of the active photograph.
- Warm/cool points now use a small white center, restrained orange/brand-blue halo, and translucent blue label chip; state remains legible by text as well as color.
- Day mode retains the same Blue Box palette with a cooler, less washed photo treatment and coordinated navigation/surface colors.
- Browser interaction QA covered all six regions, date switching, distinct 日/周/月 views, six-zone feedback submission, all nine 我的-page sheets, localStorage response, and DEGRADED safe HOLD/recovery.

Final interaction addendum result: passed
