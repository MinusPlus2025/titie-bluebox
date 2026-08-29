import { BODY_ZONES, type BodyZone, type DecisionHistory, type ThermalAction, type ThermalProfile, type ZoneSensorWindow } from "../domain/thermal.js";
import type { ValidationDataset, ValidationObservation } from "./types.js";

function profile(userId: string): ThermalProfile {
  return {
    userId,
    zoneBaselines: Object.fromEntries(BODY_ZONES.map((zone) => [zone, {
      localSkinTemp: 33.2,
      localMicroclimateTemp: 29
    }])) as ThermalProfile["zoneBaselines"]
  };
}

function actions(overrides: Partial<Record<BodyZone, ThermalAction>> = {}): Record<BodyZone, ThermalAction> {
  return Object.fromEntries(BODY_ZONES.map((zone) => [zone, overrides[zone] ?? "HOLD"])) as Record<BodyZone, ThermalAction>;
}

function window(zone: BodyZone, timestamp: string, first: number, last = first, humidity = 52): ZoneSensorWindow {
  const end = Date.parse(timestamp);
  return {
    zone,
    simulation: true,
    evidenceLabel: "Prototype Simulation",
    sensorQuality: { status: "GOOD", missingSignals: [], lastValidTimestamp: timestamp },
    samples: [
      { timestamp: new Date(end - 10 * 60_000).toISOString(), localSkinTemp: first, contactTemp: 29, localMicroclimateTemp: 29, localHumidity: humidity, bodyAverageSkinTemp: 33.2, contactState: "CONTACT", movement: 0.1 },
      { timestamp, localSkinTemp: last, contactTemp: 29, localMicroclimateTemp: 29, localHumidity: humidity, bodyAverageSkinTemp: 33.2, contactState: "CONTACT", movement: 0.1 }
    ]
  };
}

function observation(
  id: string,
  timestamp: string,
  skinByZone: Partial<Record<BodyZone, readonly [number, number]>>,
  truth: Partial<Record<BodyZone, ThermalAction>>,
  history: DecisionHistory = { feedback: [], interventions: [] }
): ValidationObservation {
  const userId = "validation-user";
  const windows = Object.fromEntries(BODY_ZONES.map((zone) => {
    const temperatures = skinByZone[zone] ?? [33.2, 33.2];
    return [zone, window(zone, timestamp, temperatures[0], temperatures[1])];
  })) as Record<BodyZone, ZoneSensorWindow>;
  return {
    id,
    userId,
    timestamp,
    profile: profile(userId),
    context: { ambientTemp: 24, ambientHumidity: 50, timeOfNight: "middle", currentTime: timestamp, sleepStage: "DEEP" },
    history,
    windows,
    groundTruth: { observationId: id, actions: actions(truth), source: "SYNTHETIC_PREFERENCE_GROUND_TRUTH" }
  };
}

const similarWarmHistory: DecisionHistory = {
  interventions: [],
  feedback: [20, 21, 22].map((day) => ({
    userId: "validation-user",
    zone: "knee_leg" as const,
    label: "暖一点" as const,
    recordedAt: `2026-08-${day}T23:00:00.000Z`,
    featureVector: {
      localTempDeviation: -0.25,
      skinTempSlopePerMinute: -0.01,
      localHumidity: 52,
      humiditySlopePerMinute: 0,
      zoneToBodyDelta: -0.25,
      timeOfNight: "middle",
      sleepStage: "DEEP" as const
    }
  }))
};

export const PHASE_2_SCENARIO_DATASET: ValidationDataset = {
  id: "phase-2-synthetic-v1",
  evidenceLabel: "Prototype Simulation",
  observations: [
    observation("stable", "2026-08-28T22:00:00.000Z", {}, {}),
    observation("opposite-zones", "2026-08-28T22:15:00.000Z", {
      shoulder_back: [33.8, 34.2],
      knee_leg: [32.5, 31.8]
    }, { shoulder_back: "COOL", knee_leg: "WARM" }),
    observation("personal-borderline", "2026-08-28T22:30:00.000Z", {
      knee_leg: [33.05, 32.95]
    }, { knee_leg: "WARM" }, similarWarmHistory),
    observation("localized-cold", "2026-08-28T22:45:00.000Z", {
      head_neck: [32.9, 32.9], shoulder_back: [32.9, 32.9], waist_abdomen: [32.9, 32.9],
      thigh: [32.9, 32.9], knee_leg: [32.1, 31.8], foot: [31.8, 31.5]
    }, { knee_leg: "WARM", foot: "WARM" }),
    observation("localized-warm", "2026-08-28T23:00:00.000Z", {
      head_neck: [33.4, 33.4], shoulder_back: [34.4, 34.8], waist_abdomen: [33.4, 33.4],
      thigh: [33.4, 33.4], knee_leg: [33.4, 33.4], foot: [33.4, 33.4]
    }, { shoulder_back: "COOL" })
  ]
};
