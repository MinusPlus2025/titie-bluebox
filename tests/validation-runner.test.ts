import { describe, expect, it } from "vitest";

import { PHASE_2_SCENARIO_DATASET } from "../src/validation/scenario-dataset.js";
import { calculateValidationMetrics, runPhase2Validation, runValidation } from "../src/validation/validation-runner.js";
import type { ValidationGroundTruth, ValidationPrediction, ValidationStrategy } from "../src/validation/types.js";
import type { BodyZone, ThermalAction } from "../src/domain/thermal.js";

const zones: BodyZone[] = ["head_neck", "shoulder_back", "waist_abdomen", "thigh", "knee_leg", "foot"];

function actions(overrides: Partial<Record<BodyZone, ThermalAction>> = {}): Record<BodyZone, ThermalAction> {
  return Object.fromEntries(zones.map((zone) => [zone, overrides[zone] ?? "HOLD"])) as Record<BodyZone, ThermalAction>;
}

describe("Validation Runner", () => {
  it("runs all three independent strategies on the same versioned dataset", () => {
    const result = runPhase2Validation();

    expect(result.reports.map(({ strategyId }) => strategyId)).toEqual([
      "fixed-whole-bed",
      "fixed-zone-threshold",
      "titie-personalized"
    ]);
    expect(new Set(result.reports.map(({ datasetId }) => datasetId))).toEqual(new Set([PHASE_2_SCENARIO_DATASET.id]));
    expect(result.reports.every(({ observationCount }) =>
      observationCount === PHASE_2_SCENARIO_DATASET.observations.length
    )).toBe(true);
  });

  it("keeps preference labels explicitly synthetic and separate from strategy output", () => {
    expect(PHASE_2_SCENARIO_DATASET.evidenceLabel).toBe("Prototype Simulation");
    expect(PHASE_2_SCENARIO_DATASET.observations.every(({ groundTruth }) =>
      groundTruth.source === "SYNTHETIC_PREFERENCE_GROUND_TRUTH"
    )).toBe(true);
  });

  it("does not expose synthetic ground truth to strategy prediction inputs", () => {
    let receivedGroundTruth = false;
    const probe: ValidationStrategy = {
      id: "fixed-zone-threshold",
      scope: "ZONE",
      predict(observation) {
        receivedGroundTruth ||= "groundTruth" in observation;
        return {
          observationId: observation.id,
          userId: observation.userId,
          timestamp: observation.timestamp,
          actions: actions()
        };
      }
    };

    runValidation(PHASE_2_SCENARIO_DATASET, [probe]);

    expect(receivedGroundTruth).toBe(false);
  });

  it("calculates preference, unnecessary intervention, and reversal from literal counts", () => {
    const groundTruth: ValidationGroundTruth[] = [
      { observationId: "one", actions: actions(), source: "SYNTHETIC_PREFERENCE_GROUND_TRUTH" },
      { observationId: "two", actions: actions({ head_neck: "COOL" }), source: "SYNTHETIC_PREFERENCE_GROUND_TRUTH" }
    ];
    const predictions: ValidationPrediction[] = [
      { observationId: "one", userId: "u", timestamp: "2026-08-28T22:00:00.000Z", actions: actions({ head_neck: "WARM" }) },
      { observationId: "two", userId: "u", timestamp: "2026-08-28T22:10:00.000Z", actions: actions({ head_neck: "COOL", foot: "WARM" }) }
    ];

    const metrics = calculateValidationMetrics(predictions, groundTruth, "ZONE");

    expect(metrics.preferenceMatch).toEqual({ numerator: 10, denominator: 12, rate: 0.8333 });
    expect(metrics.unnecessaryIntervention).toEqual({ numerator: 2, denominator: 12, rate: 0.1667 });
    expect(metrics.directionReversal).toEqual({ numerator: 1, denominator: 6, rate: 0.1667 });
    expect(metrics.wholeBedOvercorrection).toEqual({ numerator: 0, denominator: 12, rate: 0 });
  });

  it("counts mismatched zones caused by a whole-bed action as overcorrection", () => {
    const groundTruth: ValidationGroundTruth[] = [
      { observationId: "one", actions: actions({ foot: "WARM" }), source: "SYNTHETIC_PREFERENCE_GROUND_TRUTH" }
    ];
    const predictions: ValidationPrediction[] = [
      { observationId: "one", userId: "u", timestamp: "2026-08-28T22:00:00.000Z", actions: actions({ head_neck: "WARM", shoulder_back: "WARM", waist_abdomen: "WARM", thigh: "WARM", knee_leg: "WARM", foot: "WARM" }) }
    ];

    expect(calculateValidationMetrics(predictions, groundTruth, "WHOLE_BED").wholeBedOvercorrection)
      .toEqual({ numerator: 5, denominator: 6, rate: 0.8333 });
  });

  it("reports TITIE personalization gain against the fixed-zone baseline", () => {
    const result = runPhase2Validation();
    const fixedZone = result.reports.find(({ strategyId }) => strategyId === "fixed-zone-threshold")!;
    const titie = result.reports.find(({ strategyId }) => strategyId === "titie-personalized")!;

    expect(titie.personalizationGain).toBe(Number(
      (titie.metrics.preferenceMatch.rate - fixedZone.metrics.preferenceMatch.rate).toFixed(4)
    ));
    expect(titie.personalizationGain).toBeGreaterThan(0);
  });
});
