import { describe, expect, it } from "vitest";

import { decideForZone } from "../src/engine/thermal-preference-engine.js";
import type { BodyZone, DecisionHistory, PersonalizationFeatureVector, ThermalContext, ThermalFeedback, ThermalProfile, UserThermalLabel, ZoneSensorWindow } from "../src/domain/thermal.js";

const zones: BodyZone[] = ["head_neck", "shoulder_back", "waist_abdomen", "thigh", "knee_leg", "foot"];
const profile: ThermalProfile = {
  userId: "episode-user",
  zoneBaselines: Object.fromEntries(zones.map((zone) => [zone, {
    localSkinTemp: 33.2,
    localMicroclimateTemp: 29
  }])) as ThermalProfile["zoneBaselines"]
};
const context: ThermalContext = {
  ambientTemp: 24,
  ambientHumidity: 50,
  timeOfNight: "middle",
  currentTime: "2026-08-28T23:00:00.000Z",
  sleepStage: "DEEP"
};
const window: ZoneSensorWindow = {
  zone: "knee_leg",
  simulation: true,
  evidenceLabel: "Prototype Simulation",
  samples: [
    { timestamp: "2026-08-28T22:50:00.000Z", localSkinTemp: 33.05, contactTemp: 29, localMicroclimateTemp: 29, localHumidity: 52, bodyAverageSkinTemp: 33.2, contactState: "CONTACT", movement: 0.1 },
    { timestamp: "2026-08-28T23:00:00.000Z", localSkinTemp: 32.95, contactTemp: 29, localMicroclimateTemp: 29, localHumidity: 52, bodyAverageSkinTemp: 33.2, contactState: "CONTACT", movement: 0.1 }
  ]
};
const similar: PersonalizationFeatureVector = {
  localTempDeviation: -0.25,
  skinTempSlopePerMinute: -0.01,
  localHumidity: 52,
  humiditySlopePerMinute: 0,
  zoneToBodyDelta: -0.25,
  timeOfNight: "middle",
  sleepStage: "DEEP"
};
const dissimilar: PersonalizationFeatureVector = {
  localTempDeviation: 1.4,
  skinTempSlopePerMinute: 0.12,
  localHumidity: 72,
  humiditySlopePerMinute: 1,
  zoneToBodyDelta: 1.2,
  timeOfNight: "early",
  sleepStage: "AWAKE"
};

function feedback(label: UserThermalLabel, featureVector: PersonalizationFeatureVector, day: number): ThermalFeedback {
  return {
    userId: "episode-user",
    zone: "knee_leg",
    label,
    recordedAt: `2026-08-${String(day).padStart(2, "0")}T23:00:00.000Z`,
    featureVector
  };
}

function decide(feedbackEntries: ThermalFeedback[]) {
  const history: DecisionHistory = { feedback: feedbackEntries, interventions: [] };
  return decideForZone(profile, window, context, history);
}

describe("similar episode personalization", () => {
  it("lets multiple similar WARM episodes shift a borderline state toward WARM", () => {
    expect(decide([]).action).toBe("HOLD");
    expect(decide([
      feedback("暖一点", similar, 20),
      feedback("暖一点", similar, 21),
      feedback("暖一点", similar, 22)
    ]).action).toBe("WARM");
  });

  it("does not let dissimilar WARM history over-influence the current state", () => {
    const baseline = decide([]);
    const withDissimilarHistory = decide([
      feedback("暖一点", dissimilar, 20),
      feedback("暖一点", dissimilar, 21),
      feedback("暖一点", dissimilar, 22)
    ]);

    expect(withDissimilarHistory.action).toBe(baseline.action);
    expect(withDissimilarHistory.confidence).toBe(baseline.confidence);
  });

  it("reduces confidence when similar episodes contain conflicting feedback", () => {
    const aligned = decide([
      feedback("暖一点", similar, 18), feedback("暖一点", similar, 19),
      feedback("暖一点", similar, 20), feedback("暖一点", similar, 21)
    ]);
    const conflicting = decide([
      feedback("暖一点", similar, 18), feedback("暖一点", similar, 19),
      feedback("凉一点", similar, 20), feedback("凉一点", similar, 21)
    ]);

    expect(conflicting.confidence).toBeLessThan(aligned.confidence);
    expect(conflicting.reasons.map(({ code }) => code)).toContain("PERSONAL_FEEDBACK_CONFLICT");
  });

  it("caps certainty from a single similar historical episode", () => {
    const decision = decide([feedback("暖一点", similar, 20)]);

    expect(decision.action).toBe("HOLD");
    expect(decision.confidence).toBeLessThan(0.7);
  });
});
