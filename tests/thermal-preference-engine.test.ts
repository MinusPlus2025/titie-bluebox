import { describe, expect, it } from "vitest";

import { decideForZone } from "../src/engine/thermal-preference-engine.js";
import type {
  BodyZone,
  DecisionHistory,
  ThermalContext,
  ThermalProfile,
  ZoneSensorWindow
} from "../src/domain/thermal.js";

const zones: readonly BodyZone[] = [
  "head_neck", "shoulder_back", "waist_abdomen", "thigh", "knee_leg", "foot"
];

const profile: ThermalProfile = {
  userId: "user-a",
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
  cycleContext: "optional-context-must-not-select-direction"
};

const noHistory: DecisionHistory = { feedback: [], interventions: [] };

function sensorWindow(
  zone: BodyZone,
  firstSkin: number,
  lastSkin: number,
  firstHumidity = 52,
  lastHumidity = firstHumidity,
  microclimate = 29
): ZoneSensorWindow {
  return {
    zone,
    simulation: true,
    evidenceLabel: "Prototype Simulation",
    samples: [
      {
        timestamp: "2026-08-28T22:50:00.000Z",
        localSkinTemp: firstSkin,
        contactTemp: microclimate,
        localMicroclimateTemp: microclimate,
        localHumidity: firstHumidity,
        bodyAverageSkinTemp: 33.2,
        contactState: "CONTACT",
        movement: 0.1
      },
      {
        timestamp: "2026-08-28T23:00:00.000Z",
        localSkinTemp: lastSkin,
        contactTemp: microclimate,
        localMicroclimateTemp: microclimate,
        localHumidity: lastHumidity,
        bodyAverageSkinTemp: 33.2,
        contactState: "CONTACT",
        movement: 0.1
      }
    ]
  };
}

describe("decideForZone", () => {
  it("warms a zone that is well below baseline and continues falling", () => {
    const decision = decideForZone(profile, sensorWindow("knee_leg", 32.5, 31.8), context, noHistory);

    expect(decision.action).toBe("WARM");
    expect(decision.userLabel).toBe("暖一点");
    expect(decision.confidence).toBeGreaterThanOrEqual(0.6);
    expect(decision.reasons.map(({ code }) => code)).toContain("LOCAL_TEMP_FALLING");
  });

  it("cools a warm humid zone with rising humidity", () => {
    const decision = decideForZone(
      profile,
      sensorWindow("shoulder_back", 33.8, 34.2, 62, 70, 30.5),
      context,
      noHistory
    );

    expect(decision.action).toBe("COOL");
    expect(decision.userLabel).toBe("凉一点");
    expect(decision.reasons.map(({ code }) => code)).toContain("HUMIDITY_RISING");
  });

  it("uses personal feedback to change a later borderline decision", () => {
    const borderline = sensorWindow("knee_leg", 33.05, 32.95);
    const before = decideForZone(profile, borderline, context, noHistory);
    const after = decideForZone(profile, borderline, context, {
      interventions: [],
      feedback: [
        { userId: "user-a", zone: "knee_leg", label: "暖一点", recordedAt: "2026-08-27T23:00:00.000Z", featureVector: { localTempDeviation: -0.25, skinTempSlopePerMinute: -0.01, localHumidity: 52, humiditySlopePerMinute: 0, zoneToBodyDelta: -0.25, timeOfNight: "middle" } },
        { userId: "user-a", zone: "knee_leg", label: "暖一点", recordedAt: "2026-08-26T23:00:00.000Z", featureVector: { localTempDeviation: -0.25, skinTempSlopePerMinute: -0.01, localHumidity: 52, humiditySlopePerMinute: 0, zoneToBodyDelta: -0.25, timeOfNight: "middle" } }
      ]
    });

    expect(before.action).toBe("HOLD");
    expect(after.action).toBe("WARM");
    expect(after.reasons.map(({ code }) => code)).toContain("PERSONAL_WARM_PATTERN");
  });

  it("holds when mild signals conflict and confidence is low", () => {
    const decision = decideForZone(
      profile,
      sensorWindow("waist_abdomen", 33.15, 33.25, 55, 60, 28.8),
      context,
      noHistory
    );

    expect(decision.action).toBe("HOLD");
    expect(decision.intensity).toBe(0);
    expect(decision.reasons.at(-1)?.code).toBe("LOW_CONFIDENCE_HOLD");
  });

  it("prevents a reversal during the minimum intervention interval", () => {
    const decision = decideForZone(
      profile,
      sensorWindow("knee_leg", 33.8, 34.1, 62, 68, 30.5),
      context,
      {
        feedback: [],
        interventions: [{
          zone: "knee_leg",
          action: "WARM",
          intensity: 2,
          startedAt: "2026-08-28T22:57:00.000Z"
        }]
      }
    );

    expect(decision.action).toBe("WARM");
    expect(decision.intensity).toBe(2);
    expect(decision.reasons.at(-1)?.code).toBe("MINIMUM_INTERVAL_HOLD");
  });

  it("uses hysteresis to reject a weak reversal after the minimum interval", () => {
    const decision = decideForZone(
      profile,
      sensorWindow("knee_leg", 33.3, 33.45, 58, 61, 29.3),
      context,
      {
        feedback: [],
        interventions: [{
          zone: "knee_leg",
          action: "WARM",
          intensity: 1,
          startedAt: "2026-08-28T22:40:00.000Z"
        }]
      }
    );

    expect(decision.action).toBe("WARM");
    expect(decision.reasons.at(-1)?.code).toBe("HYSTERESIS_HOLD");
  });

  it("caps intensity and duration for extreme evidence", () => {
    const decision = decideForZone(profile, sensorWindow("foot", 30, 25), context, noHistory);

    expect(decision.intensity).toBe(3);
    expect(decision.durationMinutes).toBeLessThanOrEqual(15);
    expect(decision.reevaluateAfterMinutes).toBe(5);
  });
});
