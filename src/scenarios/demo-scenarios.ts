import { BODY_ZONES, type BodyZone, type DecisionHistory, type ThermalContext, type ThermalProfile, type ZoneDecision } from "../domain/thermal.js";
import { decideForBody, decideForZone } from "../engine/thermal-preference-engine.js";
import { simulateSensorWindow } from "../simulator/sensor-simulator.js";

const context: ThermalContext = {
  ambientTemp: 24,
  ambientHumidity: 50,
  timeOfNight: "middle",
  currentTime: "2026-08-28T23:00:00.000Z"
};

const noHistory: DecisionHistory = { feedback: [], interventions: [] };

function profile(userId: string, baselineSkin = 33.2): ThermalProfile {
  return {
    userId,
    zoneBaselines: Object.fromEntries(BODY_ZONES.map((zone) => [zone, {
      localSkinTemp: baselineSkin,
      localMicroclimateTemp: 29
    }])) as ThermalProfile["zoneBaselines"]
  };
}

function windowFor(
  zone: BodyZone,
  firstSkin: number,
  lastSkin: number,
  firstHumidity = 52,
  lastHumidity = firstHumidity,
  microclimate = 29
) {
  return simulateSensorWindow({
    zone,
    seed: 100 + BODY_ZONES.indexOf(zone),
    startTime: "2026-08-28T22:50:00.000Z",
    sampleCount: 2,
    intervalMinutes: 10,
    initial: {
      localSkinTemp: firstSkin,
      contactTemp: microclimate,
      localMicroclimateTemp: microclimate,
      localHumidity: firstHumidity,
      bodyAverageSkinTemp: 33.2,
      contactState: "CONTACT",
      movement: 0.1
    },
    changePerMinute: {
      localSkinTemp: (lastSkin - firstSkin) / 10,
      contactTemp: 0,
      localMicroclimateTemp: 0,
      localHumidity: (lastHumidity - firstHumidity) / 10,
      bodyAverageSkinTemp: 0,
      movement: 0
    },
    jitter: 0
  });
}

function stableBodyWindows() {
  return Object.fromEntries(BODY_ZONES.map((zone) => [zone, windowFor(zone, 33.2, 33.2)])) as
    Record<BodyZone, ReturnType<typeof windowFor>>;
}

export function runDemoScenario1(): {
  ambientTemp: number;
  userA: ZoneDecision;
  userB: ZoneDecision;
} {
  const userA = decideForZone(profile("user-a"), windowFor("knee_leg", 33.2, 33.2), context, {
    interventions: [],
    feedback: [{ userId: "user-a", zone: "knee_leg", label: "刚刚好", recordedAt: "2026-08-27T23:00:00.000Z", featureVector: { localTempDeviation: 0, skinTempSlopePerMinute: 0, localHumidity: 52, humiditySlopePerMinute: 0, zoneToBodyDelta: 0, timeOfNight: "middle" } }]
  });
  const userB = decideForZone(profile("user-b", 33.4), windowFor("knee_leg", 32.8, 32.3), context, {
    interventions: [],
    feedback: [{ userId: "user-b", zone: "knee_leg", label: "暖一点", recordedAt: "2026-08-27T23:00:00.000Z", featureVector: { localTempDeviation: -1.1, skinTempSlopePerMinute: -0.05, localHumidity: 52, humiditySlopePerMinute: 0, zoneToBodyDelta: -0.9, timeOfNight: "middle" } }]
  });
  return { ambientTemp: context.ambientTemp, userA, userB };
}

export function runDemoScenario2(): Record<"shoulder_back" | "waist_abdomen" | "knee_leg" | "foot", ZoneDecision> {
  const user = profile("user-zone-difference");
  return {
    shoulder_back: decideForZone(user, windowFor("shoulder_back", 33.8, 34.2, 62, 70, 30.5), context, noHistory),
    waist_abdomen: decideForZone(user, windowFor("waist_abdomen", 32.8, 32.4), context, noHistory),
    knee_leg: decideForZone(user, windowFor("knee_leg", 32.5, 31.8), context, noHistory),
    foot: decideForZone(user, windowFor("foot", 33.2, 33.2), context, noHistory)
  };
}

export function runDemoScenario3(): {
  nightA: ZoneDecision[];
  nightB: Record<BodyZone, ZoneDecision>;
} {
  const user = profile("user-changing-night");
  const nightA = decideForBody(user, stableBodyWindows(), context, noHistory);
  const nightBWindows = stableBodyWindows();
  nightBWindows.waist_abdomen = windowFor("waist_abdomen", 32.8, 32.2);
  const nightBHistory: DecisionHistory = {
    interventions: [],
    feedback: [{
      userId: user.userId,
      zone: "waist_abdomen",
      label: "暖一点",
      recordedAt: "2026-08-20T23:00:00.000Z",
      featureVector: { localTempDeviation: -1, skinTempSlopePerMinute: -0.06, localHumidity: 52, humiditySlopePerMinute: 0, zoneToBodyDelta: -1, timeOfNight: "middle" }
    }]
  };
  const nightB = Object.fromEntries(decideForBody(
    user,
    nightBWindows,
    { ...context, preSleepExercise: true },
    nightBHistory
  ).map((decision) => [decision.zone, decision])) as Record<BodyZone, ZoneDecision>;
  return { nightA, nightB };
}

export function runDemoScenario4(): ZoneDecision {
  return decideForZone(
    profile("user-low-confidence"),
    windowFor("waist_abdomen", 33.15, 33.25, 55, 60, 28.8),
    context,
    noHistory
  );
}

export function runDemoScenario5(): ZoneDecision {
  return decideForZone(
    profile("user-anti-oscillation"),
    windowFor("knee_leg", 33.2, 33.4, 58, 62, 29.2),
    context,
    {
      feedback: [],
      interventions: [{
        zone: "knee_leg",
        action: "WARM",
        intensity: 2,
        startedAt: "2026-08-28T22:57:00.000Z"
      }]
    }
  );
}
