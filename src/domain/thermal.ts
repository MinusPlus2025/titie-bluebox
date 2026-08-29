export const BODY_ZONES = [
  "head_neck",
  "shoulder_back",
  "waist_abdomen",
  "thigh",
  "knee_leg",
  "foot"
] as const;

export type BodyZone = (typeof BODY_ZONES)[number];
export type ThermalAction = "WARM" | "HOLD" | "COOL";
export type UserThermalLabel = "暖一点" | "刚刚好" | "凉一点";
export type ContactState = "CONTACT" | "NO_CONTACT";
export type SensorQualityStatus = "GOOD" | "DEGRADED" | "INVALID";
export type SensorSignal =
  | "localSkinTemp"
  | "contactTemp"
  | "localMicroclimateTemp"
  | "localHumidity"
  | "bodyAverageSkinTemp"
  | "movement";

export interface SensorQualityMetadata {
  status: SensorQualityStatus;
  missingSignals: readonly SensorSignal[];
  lastValidTimestamp: string;
}

export interface ZoneSensorSample {
  timestamp: string;
  localSkinTemp: number;
  contactTemp: number;
  localMicroclimateTemp: number;
  localHumidity: number;
  bodyAverageSkinTemp: number;
  contactState: ContactState;
  movement: number;
}

export interface ZoneSensorWindow {
  zone: BodyZone;
  samples: readonly ZoneSensorSample[];
  simulation: true;
  evidenceLabel: "Prototype Simulation";
  sensorQuality?: SensorQualityMetadata;
}

export interface ZoneFeatures {
  localSkinTemp: number;
  contactTemp: number;
  localMicroclimateTemp: number;
  localHumidity: number;
  skinTempSlopePerMinute: number;
  contactTempSlopePerMinute: number;
  humiditySlopePerMinute: number;
  zoneToBodyDelta: number;
  sampleCount: number;
  durationMinutes: number;
}

export interface ZoneBaseline {
  localSkinTemp: number;
  localMicroclimateTemp: number;
}

export interface ThermalProfile {
  userId: string;
  zoneBaselines: Record<BodyZone, ZoneBaseline>;
}

export interface ThermalContext {
  ambientTemp: number;
  ambientHumidity: number;
  timeOfNight: string;
  currentTime: string;
  sleepStage?: "AWAKE" | "LIGHT" | "DEEP" | "REM";
  cycleContext?: string;
  hotFlashContext?: string;
  preSleepExercise?: boolean;
}

export interface PersonalizationFeatureVector {
  localTempDeviation: number;
  skinTempSlopePerMinute: number;
  localHumidity: number;
  humiditySlopePerMinute: number;
  zoneToBodyDelta: number;
  timeOfNight: string;
  sleepStage?: ThermalContext["sleepStage"];
}

export interface ThermalFeedback {
  userId: string;
  zone: BodyZone;
  label: UserThermalLabel;
  recordedAt: string;
  featureVector?: PersonalizationFeatureVector;
}

export interface InterventionRecord {
  zone: BodyZone;
  action: Exclude<ThermalAction, "HOLD">;
  intensity: 1 | 2 | 3;
  startedAt: string;
}

export interface DecisionHistory {
  feedback: readonly ThermalFeedback[];
  interventions: readonly InterventionRecord[];
}

export type DecisionReasonCode =
  | "LOCAL_TEMP_BELOW_BASELINE"
  | "LOCAL_TEMP_ABOVE_BASELINE"
  | "LOCAL_TEMP_FALLING"
  | "LOCAL_TEMP_RISING"
  | "HUMIDITY_RISING"
  | "PERSONAL_WARM_PATTERN"
  | "PERSONAL_COOL_PATTERN"
  | "PERSONAL_FEEDBACK_CONFLICT"
  | "LOW_CONFIDENCE_HOLD"
  | "HYSTERESIS_HOLD"
  | "MINIMUM_INTERVAL_HOLD"
  | "SENSOR_QUALITY_DEGRADED"
  | "SENSOR_DATA_INVALID"
  | "STABLE_LOCAL_STATE";

export interface DecisionReason {
  code: DecisionReasonCode;
  message: string;
}

export interface ZoneDecision {
  zone: BodyZone;
  action: ThermalAction;
  userLabel: UserThermalLabel;
  intensity: 0 | 1 | 2 | 3;
  durationMinutes: number;
  confidence: number;
  reasons: readonly DecisionReason[];
  reevaluateAfterMinutes: number;
  simulation: true;
  evidenceLabel: "Prototype Simulation";
  sensorQuality: SensorQualityStatus;
}
