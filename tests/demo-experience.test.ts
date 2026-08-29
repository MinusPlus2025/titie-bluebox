import { describe, expect, it } from "vitest";

import { createDemoExperience } from "../src/app/demo-experience.js";
import { generateThermalControlCommand } from "../src/control/control-command-generator.js";
import { extractZoneFeatures } from "../src/engine/feature-extractor.js";
import { runPhase2Validation } from "../src/validation/validation-runner.js";

describe("Phase 3 demo experience integration", () => {
  it("uses real engine decisions for all six Body View zones", () => {
    const experience = createDemoExperience();
    expect(experience.body.decisions).toHaveLength(6);
    expect(experience.body.byZone.shoulder_back.userLabel).toBe("凉一点");
    expect(experience.body.byZone.knee_leg.userLabel).toBe("暖一点");
    expect(experience.body.byZone.foot.userLabel).toBe("刚刚好");
  });

  it("uses the selected ZoneDecision reasons for explanations", () => {
    const experience = createDemoExperience();

    expect(experience.explain("knee_leg").reasons)
      .toEqual(experience.body.byZone.knee_leg.reasons.map(({ message }) => message));
    expect(experience.explain("knee_leg").headline).toBe("这里可能需要暖一点");
  });

  it("uses capability-aware ThermalControlCommand values for the Digital Twin", () => {
    const experience = createDemoExperience();
    const expected = generateThermalControlCommand(
      experience.body.byZone.knee_leg,
      experience.actuatorCapability
    );

    expect(experience.control.byZone.knee_leg.command).toEqual(expected);
    expect(experience.control.byZone.knee_leg.command.simulation).toBe(true);
  });

  it("reruns a similar episode through personalization after morning feedback", () => {
    const experience = createDemoExperience();
    const before = experience.feedback.preview("knee_leg");
    const after = experience.feedback.submitAndRerun("knee_leg", "暖一点");

    expect(before.action).toBe("HOLD");
    expect(after.action).toBe("WARM");
    expect(after.reasons.map(({ code }) => code)).toContain("PERSONAL_WARM_PATTERN");
  });

  it("uses the real Validation Runner result in the validation view", () => {
    const experience = createDemoExperience();

    expect(experience.validation).toEqual(runPhase2Validation());
    expect(experience.validation.evidenceLabel).toBe("Prototype Simulation");
  });

  it("turns DEGRADED sensor input into a non-aggressive level-zero presentation", () => {
    const safety = createDemoExperience().sensorDegraded;

    expect(safety.decision.sensorQuality).toBe("DEGRADED");
    expect(safety.decision.action).toBe("HOLD");
    expect(safety.decision.intensity).toBe(0);
    expect(safety.command.direction).toBe("HOLD");
    expect(safety.command.level).toBe(0);
  });

  it("summarizes a hold-majority body without hiding the zones that need attention", () => {
    const body = createDemoExperience().body;

    expect(body.summary).toBe("今晚整体很稳定");
    expect(body.attentionZones).toEqual(["shoulder_back", "knee_leg"]);
  });

  it("exposes a real before-and-after personalization comparison", () => {
    const personalization = createDemoExperience().personalization;

    expect(personalization.before.action).toBe("HOLD");
    expect(personalization.after.action).toBe("WARM");
    expect(personalization.after.reasons.map(({ code }) => code)).toContain("PERSONAL_WARM_PATTERN");
    expect(personalization.minimumSamples).toBeGreaterThan(1);
    expect(personalization.confidenceCap).toBeLessThan(1);
  });

  it("exposes technical details computed from the selected sensor window", () => {
    const experience = createDemoExperience();

    expect(experience.technical.byZone.knee_leg.features)
      .toEqual(extractZoneFeatures(experience.technical.byZone.knee_leg.window));
    expect(experience.technical.byZone.knee_leg.similarEpisodes).toBeGreaterThan(0);
    expect(experience.technical.byZone.knee_leg.rawReasons)
      .toEqual(experience.body.byZone.knee_leg.reasons.map(({ code }) => code));
  });

  it("builds the five-night summary from real similar-episode calibration evidence", () => {
    const summary = createDemoExperience().personalization.historySummary;

    expect(summary.similarEpisodeCount).toBe(5);
    expect(summary.labelCounts).toEqual({ "暖一点": 4, "刚刚好": 1, "凉一点": 0 });
  });
});
