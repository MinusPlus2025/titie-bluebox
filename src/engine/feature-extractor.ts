import type { ZoneFeatures, ZoneSensorSample, ZoneSensorWindow } from "../domain/thermal.js";

function elapsedMinutes(first: ZoneSensorSample, last: ZoneSensorSample): number {
  const duration = (Date.parse(last.timestamp) - Date.parse(first.timestamp)) / 60_000;
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("Sensor samples require strictly increasing timestamps");
  }
  return duration;
}

function round(value: number): number {
  return Number(value.toFixed(6));
}

export function extractZoneFeatures(window: ZoneSensorWindow): ZoneFeatures {
  if (window.samples.length < 2) {
    throw new Error("A zone window requires at least two sensor samples");
  }

  const first = window.samples[0]!;
  const last = window.samples.at(-1)!;
  const durationMinutes = elapsedMinutes(first, last);

  return {
    localSkinTemp: last.localSkinTemp,
    contactTemp: last.contactTemp,
    localMicroclimateTemp: last.localMicroclimateTemp,
    localHumidity: last.localHumidity,
    skinTempSlopePerMinute: round((last.localSkinTemp - first.localSkinTemp) / durationMinutes),
    contactTempSlopePerMinute: round((last.contactTemp - first.contactTemp) / durationMinutes),
    humiditySlopePerMinute: round((last.localHumidity - first.localHumidity) / durationMinutes),
    zoneToBodyDelta: round(last.localSkinTemp - last.bodyAverageSkinTemp),
    sampleCount: window.samples.length,
    durationMinutes
  };
}
