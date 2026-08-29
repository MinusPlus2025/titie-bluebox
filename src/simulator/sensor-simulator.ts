import type { BodyZone, ZoneSensorSample, ZoneSensorWindow } from "../domain/thermal.js";

type NumericSensorField = Exclude<keyof ZoneSensorSample, "timestamp" | "contactState">;

export interface SimulationScenario {
  zone: BodyZone;
  seed: number;
  startTime: string;
  sampleCount: number;
  intervalMinutes: number;
  initial: Omit<ZoneSensorSample, "timestamp">;
  changePerMinute: Record<NumericSensorField, number>;
  jitter: number;
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function round(value: number): number {
  return Number(value.toFixed(6));
}

export function simulateSensorWindow(scenario: SimulationScenario): ZoneSensorWindow {
  if (!Number.isInteger(scenario.sampleCount) || scenario.sampleCount < 2) {
    throw new Error("A simulation requires at least two samples");
  }
  if (!Number.isFinite(scenario.intervalMinutes) || scenario.intervalMinutes <= 0) {
    throw new Error("A simulation requires a positive interval");
  }

  const startMilliseconds = Date.parse(scenario.startTime);
  if (!Number.isFinite(startMilliseconds)) {
    throw new Error("A simulation requires a valid start time");
  }

  const random = seededRandom(scenario.seed);
  const fields: readonly NumericSensorField[] = [
    "localSkinTemp",
    "contactTemp",
    "localMicroclimateTemp",
    "localHumidity",
    "bodyAverageSkinTemp",
    "movement"
  ];

  const samples = Array.from({ length: scenario.sampleCount }, (_, index): ZoneSensorSample => {
    const minutesElapsed = index * scenario.intervalMinutes;
    const values = Object.fromEntries(fields.map((field) => {
      const noise = index === 0 ? 0 : (random() * 2 - 1) * scenario.jitter;
      return [field, round(scenario.initial[field] + scenario.changePerMinute[field] * minutesElapsed + noise)];
    })) as Record<NumericSensorField, number>;

    return {
      timestamp: new Date(startMilliseconds + minutesElapsed * 60_000).toISOString(),
      ...values,
      contactState: scenario.initial.contactState
    };
  });

  return {
    zone: scenario.zone,
    samples,
    simulation: true,
    evidenceLabel: "Prototype Simulation",
    sensorQuality: {
      status: "GOOD",
      missingSignals: [],
      lastValidTimestamp: samples.at(-1)!.timestamp
    }
  };
}
