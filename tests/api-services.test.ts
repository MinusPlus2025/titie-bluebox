import { describe, expect, it } from "vitest";

import { applyThermalFeedback, evaluateThermalPreference, getValidationResult } from "../src/api/services.js";
import { PHASE_2_SCENARIO_DATASET } from "../src/validation/scenario-dataset.js";
import type { ZoneSensorWindow } from "../src/domain/thermal.js";

function requestFor(id = "personal-borderline") {
  const observation = PHASE_2_SCENARIO_DATASET.observations.find((item) => item.id === id)!;
  return {
    profile: observation.profile,
    window: observation.windows.knee_leg,
    context: observation.context,
    history: observation.history
  };
}

describe("API service contracts", () => {
  it("evaluates a valid zone through the frozen thermal engine", () => {
    const decision = evaluateThermalPreference(requestFor());
    expect(decision.zone).toBe("knee_leg");
    expect(decision.evidenceLabel).toBe("Prototype Simulation");
  });

  it("returns HOLD for DEGRADED sensor data", () => {
    const request = requestFor("localized-cold");
    const window: ZoneSensorWindow = {
      ...request.window,
      sensorQuality: {
        status: "DEGRADED",
        missingSignals: ["localHumidity"],
        lastValidTimestamp: request.context.currentTime
      }
    };
    const decision = evaluateThermalPreference({ ...request, window });
    expect(decision.sensorQuality).toBe("DEGRADED");
    expect(decision.action).toBe("HOLD");
    expect(decision.intensity).toBe(0);
  });

  it("returns HOLD for INVALID sensor data", () => {
    const request = requestFor("localized-cold");
    const window: ZoneSensorWindow = {
      ...request.window,
      sensorQuality: {
        status: "INVALID",
        missingSignals: ["localSkinTemp"],
        lastValidTimestamp: request.context.currentTime
      }
    };
    const decision = evaluateThermalPreference({ ...request, window });
    expect(decision.sensorQuality).toBe("INVALID");
    expect(decision.action).toBe("HOLD");
    expect(decision.intensity).toBe(0);
  });

  it("accepts feedback and reruns the same episode", () => {
    const result = applyThermalFeedback({ ...requestFor(), label: "暖一点" });
    expect(result.accepted).toBe(true);
    expect(result.feedback.label).toBe("暖一点");
    expect(result.after.zone).toBe("knee_leg");
  });

  it("returns the versioned synthetic validation report", () => {
    const result = getValidationResult();
    expect(result.datasetId).toBe("phase-2-synthetic-v1");
    expect(result.reports).toHaveLength(3);
  });
});
