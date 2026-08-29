import type {
  BodyZone,
  DecisionHistory,
  ThermalAction,
  ThermalContext,
  ThermalProfile,
  ZoneSensorWindow
} from "../domain/thermal.js";

export type ValidationControlScope = "WHOLE_BED" | "ZONE";

export interface ValidationGroundTruth {
  observationId: string;
  actions: Readonly<Record<BodyZone, ThermalAction>>;
  source: "SYNTHETIC_PREFERENCE_GROUND_TRUTH";
}

export interface ValidationObservation {
  id: string;
  userId: string;
  timestamp: string;
  profile: ThermalProfile;
  context: ThermalContext;
  history: DecisionHistory;
  windows: Readonly<Record<BodyZone, ZoneSensorWindow>>;
  groundTruth: ValidationGroundTruth;
}

export interface ValidationDataset {
  id: string;
  evidenceLabel: "Prototype Simulation";
  observations: readonly ValidationObservation[];
}

export type ValidationStrategyInput = Omit<ValidationObservation, "groundTruth">;

export interface ValidationPrediction {
  observationId: string;
  userId: string;
  timestamp: string;
  actions: Readonly<Record<BodyZone, ThermalAction>>;
}

export interface ValidationStrategy {
  id: "fixed-whole-bed" | "fixed-zone-threshold" | "titie-personalized";
  scope: ValidationControlScope;
  predict(observation: ValidationStrategyInput): ValidationPrediction;
}

export interface RateMetric {
  numerator: number;
  denominator: number;
  rate: number;
}

export interface ValidationMetrics {
  preferenceMatch: RateMetric;
  unnecessaryIntervention: RateMetric;
  wholeBedOvercorrection: RateMetric;
  directionReversal: RateMetric;
}

export interface ValidationReport {
  strategyId: ValidationStrategy["id"];
  datasetId: string;
  observationCount: number;
  metrics: ValidationMetrics;
  personalizationGain: number;
  evidenceLabel: "Prototype Simulation";
}

export interface ValidationRunResult {
  datasetId: string;
  reports: readonly ValidationReport[];
  evidenceLabel: "Prototype Simulation";
  disclaimer: "Synthetic software validation only; not clinical or field evidence.";
}
