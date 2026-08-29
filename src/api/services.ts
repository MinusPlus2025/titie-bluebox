import { BODY_ZONES, type DecisionHistory, type PersonalizationFeatureVector, type ThermalContext, type ThermalFeedback, type ThermalProfile, type UserThermalLabel, type ZoneSensorWindow } from "../domain/thermal.js";
import { decideForZone } from "../engine/thermal-preference-engine.js";
import { extractZoneFeatures } from "../engine/feature-extractor.js";
import { runPhase2Validation } from "../validation/validation-runner.js";
import { generateThermalControlCommand } from "../control/control-command-generator.js";
import { PROTOTYPE_ACTUATOR_CAPABILITY } from "../control/prototype-actuator.js";
import { calibrateFromFeedback } from "../engine/personal-calibration.js";

export interface EvaluationRequest {
  profile: ThermalProfile;
  window: ZoneSensorWindow;
  context: ThermalContext;
  history?: DecisionHistory;
}

export interface FeedbackRequest extends EvaluationRequest {
  label: UserThermalLabel;
}

const EMPTY_HISTORY: DecisionHistory = { feedback: [], interventions: [] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireEvaluationRequest(value: unknown): EvaluationRequest {
  if (!isRecord(value) || !isRecord(value.profile) || !isRecord(value.window) || !isRecord(value.context)) {
    throw new TypeError("Expected profile, window, and context objects");
  }
  if (!BODY_ZONES.includes(value.window.zone as (typeof BODY_ZONES)[number])) {
    throw new TypeError("window.zone must be a supported body zone");
  }
  if (!Array.isArray(value.window.samples) || value.window.samples.length < 2) {
    throw new TypeError("window.samples must contain at least two samples");
  }
  return value as unknown as EvaluationRequest;
}

export function evaluateThermalPreference(value: unknown) {
  const request = requireEvaluationRequest(value);
  const history = request.history ?? EMPTY_HISTORY;
  const decision = decideForZone(
    request.profile,
    request.window,
    request.context,
    history
  );
  const features = extractZoneFeatures(request.window);
  const baseline = request.profile.zoneBaselines[request.window.zone];
  const vector: PersonalizationFeatureVector = {
    localTempDeviation: features.localSkinTemp - baseline.localSkinTemp,
    skinTempSlopePerMinute: features.skinTempSlopePerMinute,
    localHumidity: features.localHumidity,
    humiditySlopePerMinute: features.humiditySlopePerMinute,
    zoneToBodyDelta: features.zoneToBodyDelta,
    timeOfNight: request.context.timeOfNight,
    ...(request.context.sleepStage ? { sleepStage: request.context.sleepStage } : {})
  };
  const calibration = calibrateFromFeedback(request.profile.userId, request.window.zone, history.feedback, vector);
  return {
    ...decision,
    controlCommand: generateThermalControlCommand(decision, PROTOTYPE_ACTUATOR_CAPABILITY),
    diagnostics: {
      skinTempSlopePerMinute: features.skinTempSlopePerMinute,
      humiditySlopePerMinute: features.humiditySlopePerMinute,
      localHumidity: features.localHumidity,
      zoneToBodyDelta: features.zoneToBodyDelta,
      similarEpisodeCount: calibration.feedbackCount
    }
  };
}

export function applyThermalFeedback(value: unknown) {
  const request = requireEvaluationRequest(value);
  const label = isRecord(value) ? value.label : undefined;
  if (label !== "暖一点" && label !== "刚刚好" && label !== "凉一点") {
    throw new TypeError("label must be 暖一点, 刚刚好, or 凉一点");
  }

  const history = request.history ?? EMPTY_HISTORY;
  const before = decideForZone(request.profile, request.window, request.context, history);
  const features = extractZoneFeatures(request.window);
  const baseline = request.profile.zoneBaselines[request.window.zone];
  const featureVector: PersonalizationFeatureVector = {
    localTempDeviation: features.localSkinTemp - baseline.localSkinTemp,
    skinTempSlopePerMinute: features.skinTempSlopePerMinute,
    localHumidity: features.localHumidity,
    humiditySlopePerMinute: features.humiditySlopePerMinute,
    zoneToBodyDelta: features.zoneToBodyDelta,
    timeOfNight: request.context.timeOfNight,
    ...(request.context.sleepStage ? { sleepStage: request.context.sleepStage } : {})
  };
  const feedback: ThermalFeedback = {
    userId: request.profile.userId,
    zone: request.window.zone,
    label,
    recordedAt: request.context.currentTime,
    featureVector
  };
  const updatedHistory: DecisionHistory = {
    feedback: [...history.feedback, feedback],
    interventions: history.interventions
  };

  return {
    accepted: true,
    feedback,
    before,
    after: decideForZone(request.profile, request.window, request.context, updatedHistory),
    simulation: true,
    evidenceLabel: "Prototype Simulation" as const
  };
}

export function getValidationResult() {
  return runPhase2Validation();
}
