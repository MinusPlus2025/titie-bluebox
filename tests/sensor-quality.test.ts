import { describe, expect, it } from "vitest";

import { assessSensorQuality } from "../src/sensors/sensor-quality.js";
import { decideForZone } from "../src/engine/thermal-preference-engine.js";
import type { BodyZone, DecisionHistory, ThermalContext, ThermalProfile, ZoneSensorWindow } from "../src/domain/thermal.js";

const zones: BodyZone[] = ["head_neck", "shoulder_back", "waist_abdomen", "thigh", "knee_leg", "foot"];
const profile: ThermalProfile = {
  userId: "quality-user",
  zoneBaselines: Object.fromEntries(zones.map((zone) => [zone, {
    localSkinTemp: 33.2,
    localMicroclimateTemp: 29
  }])) as ThermalProfile["zoneBaselines"]
};
const context: ThermalContext = {
  ambientTemp: 24,
  ambientHumidity: 50,
  timeOfNight: "middle",
  currentTime: "2026-08-28T23:00:00.000Z"
};
const history: DecisionHistory = { feedback: [], interventions: [] };

function coldWindow(overrides: Partial<ZoneSensorWindow> = {}): ZoneSensorWindow {
  return {
    zone: "knee_leg",
    simulation: true,
    evidenceLabel: "Prototype Simulation",
    samples: [
      {
        timestamp: "2026-08-28T22:50:00.000Z",
        localSkinTemp: 32.5,
        contactTemp: 29,
        localMicroclimateTemp: 29,
        localHumidity: 52,
        bodyAverageSkinTemp: 33.2,
        contactState: "CONTACT",
        movement: 0.1
      },
      {
        timestamp: "2026-08-28T23:00:00.000Z",
        localSkinTemp: 31.8,
        contactTemp: 28.8,
        localMicroclimateTemp: 28.8,
        localHumidity: 53,
        bodyAverageSkinTemp: 33.2,
        contactState: "CONTACT",
        movement: 0.1
      }
    ],
    ...overrides
  };
}

describe("sensor quality degradation", () => {
  it("marks a missing non-critical signal DEGRADED and lowers engine confidence", () => {
    const goodWindow = coldWindow();
    const missingHumidity = coldWindow({
      sensorQuality: {
        status: "DEGRADED",
        missingSignals: ["localHumidity"],
        lastValidTimestamp: "2026-08-28T23:00:00.000Z"
      }
    });

    const quality = assessSensorQuality(missingHumidity, context.currentTime);
    const goodDecision = decideForZone(profile, goodWindow, context, history);
    const degradedDecision = decideForZone(profile, missingHumidity, context, history);

    expect(quality.status).toBe("DEGRADED");
    expect(degradedDecision.confidence).toBeLessThan(goodDecision.confidence);
    expect(degradedDecision.action).toBe("HOLD");
    expect(degradedDecision.intensity).toBe(0);
    expect(degradedDecision.durationMinutes).toBe(0);
  });

  it("treats an implausible local skin temperature spike as INVALID and holds", () => {
    const spike = coldWindow({
      samples: [
        { ...coldWindow().samples[0]!, timestamp: "2026-08-28T22:59:00.000Z", localSkinTemp: 32.5 },
        { ...coldWindow().samples[1]!, localSkinTemp: 39.5 }
      ]
    });

    expect(assessSensorQuality(spike, context.currentTime).status).toBe("INVALID");
    expect(decideForZone(profile, spike, context, history).action).toBe("HOLD");
    expect(decideForZone(profile, spike, context, history).durationMinutes).toBe(0);
  });

  it("treats stale data as INVALID and safely holds", () => {
    const stale = coldWindow({
      sensorQuality: {
        status: "GOOD",
        missingSignals: [],
        lastValidTimestamp: "2026-08-28T22:40:00.000Z"
      }
    });
    const quality = assessSensorQuality(stale, context.currentTime);
    const decision = decideForZone(profile, stale, context, history);

    expect(quality.status).toBe("INVALID");
    expect(quality.issues).toContain("STALE_DATA");
    expect(decision.action).toBe("HOLD");
    expect(decision.intensity).toBe(0);
  });

  it("treats lost zone contact as INVALID and never intervenes", () => {
    const noContact = coldWindow({
      samples: coldWindow().samples.map((sample) => ({ ...sample, contactState: "NO_CONTACT" }))
    });
    const quality = assessSensorQuality(noContact, context.currentTime);
    const decision = decideForZone(profile, noContact, context, history);

    expect(quality.status).toBe("INVALID");
    expect(quality.issues).toContain("ZONE_CONTACT_LOST");
    expect(decision.action).toBe("HOLD");
    expect(decision.confidence).toBeLessThan(0.6);
  });
});
