import { BODY_ZONES } from "../domain/thermal.js";
import { PHASE_2_SCENARIO_DATASET } from "./scenario-dataset.js";
import { PHASE_2_VALIDATION_STRATEGIES } from "./strategies.js";
import type {
  RateMetric,
  ValidationControlScope,
  ValidationDataset,
  ValidationGroundTruth,
  ValidationMetrics,
  ValidationPrediction,
  ValidationRunResult,
  ValidationStrategy
} from "./types.js";

function rate(numerator: number, denominator: number): RateMetric {
  return { numerator, denominator, rate: denominator === 0 ? 0 : Number((numerator / denominator).toFixed(4)) };
}

export function calculateValidationMetrics(
  predictions: readonly ValidationPrediction[],
  groundTruth: readonly ValidationGroundTruth[],
  scope: ValidationControlScope
): ValidationMetrics {
  const truthByObservation = new Map(groundTruth.map((truth) => [truth.observationId, truth]));
  let preferenceMatches = 0;
  let unnecessaryInterventions = 0;
  let wholeBedOvercorrections = 0;

  for (const prediction of predictions) {
    const truth = truthByObservation.get(prediction.observationId);
    if (!truth) throw new Error(`Missing synthetic ground truth for ${prediction.observationId}`);
    for (const zone of BODY_ZONES) {
      const predicted = prediction.actions[zone];
      const expected = truth.actions[zone];
      if (predicted === expected) preferenceMatches += 1;
      if (predicted !== "HOLD" && expected === "HOLD") unnecessaryInterventions += 1;
      if (scope === "WHOLE_BED" && predicted !== "HOLD" && predicted !== expected) wholeBedOvercorrections += 1;
    }
  }

  let reversals = 0;
  let reversalOpportunities = 0;
  const previousByUser = new Map<string, ValidationPrediction>();
  for (const prediction of [...predictions].sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp))) {
    const previous = previousByUser.get(prediction.userId);
    if (previous) {
      reversalOpportunities += BODY_ZONES.length;
      for (const zone of BODY_ZONES) {
        const before = previous.actions[zone];
        const after = prediction.actions[zone];
        if ((before === "WARM" && after === "COOL") || (before === "COOL" && after === "WARM")) reversals += 1;
      }
    }
    previousByUser.set(prediction.userId, prediction);
  }

  const totalDecisions = predictions.length * BODY_ZONES.length;
  return {
    preferenceMatch: rate(preferenceMatches, totalDecisions),
    unnecessaryIntervention: rate(unnecessaryInterventions, totalDecisions),
    wholeBedOvercorrection: rate(wholeBedOvercorrections, totalDecisions),
    directionReversal: rate(reversals, reversalOpportunities)
  };
}

export function runValidation(
  dataset: ValidationDataset,
  strategies: readonly ValidationStrategy[]
): ValidationRunResult {
  const intermediate = strategies.map((strategy) => {
    const predictions = dataset.observations.map(({ groundTruth: _groundTruth, ...strategyInput }) =>
      strategy.predict(strategyInput)
    );
    return {
      strategy,
      metrics: calculateValidationMetrics(predictions, dataset.observations.map(({ groundTruth }) => groundTruth), strategy.scope)
    };
  });
  const fixedZoneMatch = intermediate.find(({ strategy }) => strategy.id === "fixed-zone-threshold")?.metrics.preferenceMatch.rate ?? 0;
  return {
    datasetId: dataset.id,
    reports: intermediate.map(({ strategy, metrics }) => ({
      strategyId: strategy.id,
      datasetId: dataset.id,
      observationCount: dataset.observations.length,
      metrics,
      personalizationGain: strategy.id === "titie-personalized"
        ? Number((metrics.preferenceMatch.rate - fixedZoneMatch).toFixed(4))
        : 0,
      evidenceLabel: "Prototype Simulation"
    })),
    evidenceLabel: "Prototype Simulation",
    disclaimer: "Synthetic software validation only; not clinical or field evidence."
  };
}

export function runPhase2Validation(): ValidationRunResult {
  return runValidation(PHASE_2_SCENARIO_DATASET, PHASE_2_VALIDATION_STRATEGIES);
}
