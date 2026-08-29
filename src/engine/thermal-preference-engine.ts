import type {
  BodyZone,
  DecisionHistory,
  DecisionReason,
  ThermalAction,
  ThermalContext,
  ThermalProfile,
  UserThermalLabel,
  ZoneDecision,
  ZoneSensorWindow
} from "../domain/thermal.js";
import { applyControlPolicy } from "./control-policy.js";
import { extractZoneFeatures } from "./feature-extractor.js";
import { calibrateFromFeedback } from "./personal-calibration.js";
import { assessSensorQuality } from "../sensors/sensor-quality.js";

const ACTION_CONFIDENCE_THRESHOLD = 0.6;
const DIRECTION_THRESHOLD = 0.45;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function labelFor(action: ThermalAction): UserThermalLabel {
  if (action === "WARM") return "暖一点";
  if (action === "COOL") return "凉一点";
  return "刚刚好";
}

export function decideForZone(
  profile: ThermalProfile,
  zoneSensorWindow: ZoneSensorWindow,
  context: ThermalContext,
  history: DecisionHistory
): ZoneDecision {
  const zone = zoneSensorWindow.zone;
  const sensorQuality = assessSensorQuality(zoneSensorWindow, context.currentTime);
  if (sensorQuality.status !== "GOOD") {
    const degraded = sensorQuality.status === "DEGRADED";
    return {
      zone,
      action: "HOLD",
      userLabel: "刚刚好",
      intensity: 0,
      durationMinutes: 0,
      confidence: sensorQuality.confidenceMultiplier,
      reasons: [{
        code: degraded ? "SENSOR_QUALITY_DEGRADED" : "SENSOR_DATA_INVALID",
        message: degraded
          ? "部分传感信号不够稳定，先不调整，继续观察。"
          : "关键传感数据不可靠，已安全停止调节"
      }],
      reevaluateAfterMinutes: 2,
      simulation: true,
      evidenceLabel: "Prototype Simulation",
      sensorQuality: sensorQuality.status
    };
  }
  const baseline = profile.zoneBaselines[zone];
  const features = extractZoneFeatures(zoneSensorWindow);
  const skinDelta = features.localSkinTemp - baseline.localSkinTemp;
  const calibration = calibrateFromFeedback(profile.userId, zone, history.feedback, {
    localTempDeviation: skinDelta,
    skinTempSlopePerMinute: features.skinTempSlopePerMinute,
    localHumidity: features.localHumidity,
    humiditySlopePerMinute: features.humiditySlopePerMinute,
    zoneToBodyDelta: features.zoneToBodyDelta,
    timeOfNight: context.timeOfNight,
    ...(context.sleepStage ? { sleepStage: context.sleepStage } : {})
  });
  const microclimateDelta = features.localMicroclimateTemp - baseline.localMicroclimateTemp;
  const reasons: DecisionReason[] = [];

  let warmEvidence = 0;
  let coolEvidence = 0;

  if (skinDelta < -0.1) {
    warmEvidence += -skinDelta * 0.65;
    reasons.push({ code: "LOCAL_TEMP_BELOW_BASELINE", message: "局部温度低于你的该区基线" });
  } else if (skinDelta > 0.1) {
    coolEvidence += skinDelta * 0.65;
    reasons.push({ code: "LOCAL_TEMP_ABOVE_BASELINE", message: "局部温度高于你的该区基线" });
  }
  if (features.skinTempSlopePerMinute < -0.005) {
    warmEvidence += -features.skinTempSlopePerMinute * 4;
    reasons.push({ code: "LOCAL_TEMP_FALLING", message: "最近局部温度持续下降" });
  } else if (features.skinTempSlopePerMinute > 0.005) {
    coolEvidence += features.skinTempSlopePerMinute * 4;
    reasons.push({ code: "LOCAL_TEMP_RISING", message: "最近局部温度持续上升" });
  }

  warmEvidence += Math.max(0, -features.zoneToBodyDelta) * 0.2;
  warmEvidence += Math.max(0, -microclimateDelta) * 0.15;
  coolEvidence += Math.max(0, microclimateDelta) * 0.15;
  coolEvidence += Math.max(0, features.localHumidity - 60) * 0.04;
  if (features.humiditySlopePerMinute > 0.1) {
    coolEvidence += features.humiditySlopePerMinute * 0.2;
    reasons.push({ code: "HUMIDITY_RISING", message: "局部湿度正在上升" });
  }
  reasons.push(...calibration.reasons);
  const netWarmthNeed = warmEvidence - coolEvidence + calibration.directionalBias;
  const preferredDirection: ThermalAction = netWarmthNeed >= 0
    ? (Math.abs(netWarmthNeed) >= 0.01 ? "WARM" : "HOLD")
    : "COOL";
  const conflict = Math.min(warmEvidence, coolEvidence);
  const confidence = Number((clamp(
    0.4 + Math.max(warmEvidence, coolEvidence) * 0.3 + calibration.confidenceAdjustment - conflict * 0.2,
    0,
    0.99
  ) * sensorQuality.confidenceMultiplier).toFixed(2));

  let action: ThermalAction = Math.abs(netWarmthNeed) >= DIRECTION_THRESHOLD
    ? (netWarmthNeed > 0 ? "WARM" : "COOL")
    : "HOLD";
  if (confidence < ACTION_CONFIDENCE_THRESHOLD) action = "HOLD";
  if (action === "HOLD") {
    reasons.push({
      code: "LOW_CONFIDENCE_HOLD",
      message: "这一判断置信度较低，因此保持不动"
    });
  }

  const previous = history.interventions
    .filter((entry) => entry.zone === zone)
    .sort((left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt))[0];
  const policy = applyControlPolicy({
    action,
    preferredDirection,
    intensity: Math.ceil(Math.abs(netWarmthNeed)),
    durationMinutes: 5 + Math.ceil(Math.abs(netWarmthNeed) * 4),
    confidence,
    reasons,
    directionalStrength: Math.abs(netWarmthNeed)
  }, previous, context);

  return {
    zone,
    action: policy.action,
    userLabel: labelFor(policy.action),
    intensity: policy.intensity,
    durationMinutes: policy.durationMinutes,
    confidence: policy.confidence,
    reasons: policy.reasons,
    reevaluateAfterMinutes: 5,
    simulation: true,
    evidenceLabel: "Prototype Simulation",
    sensorQuality: sensorQuality.status
  };
}

export function decideForBody(
  profile: ThermalProfile,
  bodySensorWindows: Readonly<Record<BodyZone, ZoneSensorWindow>>,
  context: ThermalContext,
  history: DecisionHistory
): ZoneDecision[] {
  return Object.values(bodySensorWindows).map((window) =>
    decideForZone(profile, window, context, history)
  );
}
