import type {
  DecisionReason,
  InterventionRecord,
  ThermalAction,
  ThermalContext
} from "../domain/thermal.js";

export interface PolicyCandidate {
  action: ThermalAction;
  preferredDirection: ThermalAction;
  intensity: number;
  durationMinutes: number;
  confidence: number;
  reasons: readonly DecisionReason[];
  directionalStrength: number;
}

export interface PolicyResult extends Omit<PolicyCandidate, "preferredDirection" | "directionalStrength"> {
  intensity: 0 | 1 | 2 | 3;
}

const MINIMUM_INTERVENTION_INTERVAL_MINUTES = 8;
const REVERSAL_HYSTERESIS_STRENGTH = 0.75;

function minutesSince(timestamp: string, context: ThermalContext): number {
  return (Date.parse(context.currentTime) - Date.parse(timestamp)) / 60_000;
}

function preserveIntervention(
  previous: InterventionRecord,
  candidate: PolicyCandidate,
  reason: DecisionReason
): PolicyResult {
  return {
    action: previous.action,
    intensity: previous.intensity,
    durationMinutes: Math.min(15, candidate.durationMinutes),
    confidence: candidate.confidence,
    reasons: [...candidate.reasons, reason]
  };
}

export function applyControlPolicy(
  candidate: PolicyCandidate,
  previous: InterventionRecord | undefined,
  context: ThermalContext
): PolicyResult {
  if (previous && candidate.preferredDirection !== "HOLD" && candidate.preferredDirection !== previous.action) {
    if (minutesSince(previous.startedAt, context) < MINIMUM_INTERVENTION_INTERVAL_MINUTES) {
      return preserveIntervention(previous, candidate, {
        code: "MINIMUM_INTERVAL_HOLD",
        message: "近期已经调节，暂不反向切换，继续观察"
      });
    }
    if (candidate.directionalStrength < REVERSAL_HYSTERESIS_STRENGTH) {
      return preserveIntervention(previous, candidate, {
        code: "HYSTERESIS_HOLD",
        message: "反向信号较弱，保持当前策略以避免反复调节"
      });
    }
  }

  const intensity = Math.max(0, Math.min(3, Math.round(candidate.intensity))) as 0 | 1 | 2 | 3;
  return {
    action: candidate.action,
    intensity: candidate.action === "HOLD" ? 0 : intensity,
    durationMinutes: candidate.action === "HOLD" ? 0 : Math.min(15, candidate.durationMinutes),
    confidence: candidate.confidence,
    reasons: candidate.reasons
  };
}
