import type { SensorQualityStatus, SensorSignal, ZoneSensorWindow } from "../domain/thermal.js";

export type SensorQualityIssue =
  | "MISSING_SIGNAL"
  | "SENSOR_SPIKE"
  | "STALE_DATA"
  | "ZONE_CONTACT_LOST";

export interface SensorQualityAssessment {
  status: SensorQualityStatus;
  confidenceMultiplier: number;
  issues: readonly SensorQualityIssue[];
  missingSignals: readonly SensorSignal[];
  lastValidTimestamp: string;
  safeToIntervene: boolean;
}

const STALE_AFTER_MINUTES = 10;
const MAX_SKIN_CHANGE_PER_MINUTE = 3;
const CRITICAL_SIGNALS: readonly SensorSignal[] = ["localSkinTemp", "contactTemp"];

function hasSkinSpike(window: ZoneSensorWindow): boolean {
  return window.samples.slice(1).some((sample, index) => {
    const previous = window.samples[index]!;
    const elapsedMinutes = (Date.parse(sample.timestamp) - Date.parse(previous.timestamp)) / 60_000;
    if (elapsedMinutes <= 0) return true;
    return Math.abs(sample.localSkinTemp - previous.localSkinTemp) / elapsedMinutes > MAX_SKIN_CHANGE_PER_MINUTE;
  });
}

export function assessSensorQuality(
  window: ZoneSensorWindow,
  currentTime: string
): SensorQualityAssessment {
  const latest = window.samples.at(-1);
  const metadata = window.sensorQuality;
  const lastValidTimestamp = metadata?.lastValidTimestamp ?? latest?.timestamp ?? "";
  const missingSignals = metadata?.missingSignals ?? [];
  const issues: SensorQualityIssue[] = [];

  if (missingSignals.length > 0) issues.push("MISSING_SIGNAL");
  if (latest?.contactState === "NO_CONTACT") issues.push("ZONE_CONTACT_LOST");
  if (hasSkinSpike(window)) issues.push("SENSOR_SPIKE");

  const staleMinutes = (Date.parse(currentTime) - Date.parse(lastValidTimestamp)) / 60_000;
  if (!Number.isFinite(staleMinutes) || staleMinutes > STALE_AFTER_MINUTES) issues.push("STALE_DATA");

  const criticalSignalMissing = missingSignals.some((signal) => CRITICAL_SIGNALS.includes(signal));
  const invalid = metadata?.status === "INVALID"
    || criticalSignalMissing
    || issues.includes("SENSOR_SPIKE")
    || issues.includes("STALE_DATA")
    || issues.includes("ZONE_CONTACT_LOST");
  const degraded = !invalid && (metadata?.status === "DEGRADED" || issues.length > 0);
  const status: SensorQualityStatus = invalid ? "INVALID" : degraded ? "DEGRADED" : "GOOD";

  return {
    status,
    confidenceMultiplier: status === "GOOD" ? 1 : status === "DEGRADED" ? 0.7 : 0.25,
    issues,
    missingSignals,
    lastValidTimestamp,
    safeToIntervene: status !== "INVALID"
  };
}
