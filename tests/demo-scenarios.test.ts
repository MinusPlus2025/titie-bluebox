import { describe, expect, it } from "vitest";

import {
  runDemoScenario1,
  runDemoScenario2,
  runDemoScenario3,
  runDemoScenario4,
  runDemoScenario5
} from "../src/scenarios/demo-scenarios.js";

describe("fixed Prototype Simulation demo scenarios", () => {
  it("Scenario 1: same room temperature can produce different personal decisions", () => {
    const result = runDemoScenario1();

    expect(result.ambientTemp).toBe(24);
    expect(result.userA.action).toBe("HOLD");
    expect(result.userB.action).toBe("WARM");
  });

  it("Scenario 2: one person can need opposite actions in different zones", () => {
    const decisions = runDemoScenario2();

    expect(decisions.shoulder_back.action).toBe("COOL");
    expect(decisions.knee_leg.action).toBe("WARM");
    expect(decisions.foot.action).toBe("HOLD");
  });

  it("Scenario 3: similar ambient conditions can produce a different later night", () => {
    const result = runDemoScenario3();

    expect(result.nightA.filter(({ action }) => action === "HOLD").length).toBeGreaterThanOrEqual(5);
    expect(result.nightB.waist_abdomen.action).toBe("WARM");
  });

  it("Scenario 4: weak contradictory evidence produces an explained HOLD", () => {
    const decision = runDemoScenario4();

    expect(decision.action).toBe("HOLD");
    expect(decision.reasons.map(({ code }) => code)).toContain("LOW_CONFIDENCE_HOLD");
  });

  it("Scenario 5: a recent WARM intervention cannot oscillate on a weak reverse reading", () => {
    const decision = runDemoScenario5();

    expect(decision.action).toBe("WARM");
    expect(decision.reasons.at(-1)?.code).toBe("MINIMUM_INTERVAL_HOLD");
  });

  it("keeps the synthetic evidence boundary visible in every scenario output", () => {
    const results = [
      runDemoScenario1().userA,
      ...Object.values(runDemoScenario2()),
      ...runDemoScenario3().nightA,
      runDemoScenario4(),
      runDemoScenario5()
    ];

    expect(results.every((decision) =>
      decision.simulation && decision.evidenceLabel === "Prototype Simulation"
    )).toBe(true);
  });
});
