import { generateThermalControlCommand } from "../control/control-command-generator.js";
import { PROTOTYPE_ACTUATOR_CAPABILITY } from "../control/prototype-actuator.js";
import type { ThermalControlCommand } from "../domain/control.js";
import {
  BODY_ZONES,
  type BodyZone,
  type DecisionHistory,
  type PersonalizationFeatureVector,
  type ThermalFeedback,
  type UserThermalLabel,
  type ZoneDecision,
  type ZoneSensorWindow
} from "../domain/thermal.js";
import { extractZoneFeatures } from "../engine/feature-extractor.js";
import { calibrateFromFeedback } from "../engine/personal-calibration.js";
import { decideForZone } from "../engine/thermal-preference-engine.js";
import { PHASE_2_SCENARIO_DATASET } from "../validation/scenario-dataset.js";
import { runPhase2Validation } from "../validation/validation-runner.js";

export interface ZoneExplanation {
  headline: string;
  reasons: readonly string[];
  contextReasons: readonly string[];
}

export interface ZoneControlPresentation {
  decision: ZoneDecision;
  command: ThermalControlCommand;
}

function featureVector(window: ZoneSensorWindow, baseline: number, timeOfNight: string): PersonalizationFeatureVector {
  const features = extractZoneFeatures(window);
  return {
    localTempDeviation: features.localSkinTemp - baseline,
    skinTempSlopePerMinute: features.skinTempSlopePerMinute,
    localHumidity: features.localHumidity,
    humiditySlopePerMinute: features.humiditySlopePerMinute,
    zoneToBodyDelta: features.zoneToBodyDelta,
    timeOfNight,
    sleepStage: "DEEP"
  };
}

function fiveNightHistory(userId: string, vector: PersonalizationFeatureVector): readonly ThermalFeedback[] {
  const labels: readonly UserThermalLabel[] = ["暖一点", "暖一点", "暖一点", "暖一点", "刚刚好"];
  return labels.map((label, index) => ({
    userId,
    zone: "knee_leg",
    label,
    recordedAt: `2026-08-${20 + index}T23:48:00.000Z`,
    featureVector: vector
  }));
}

function degradedWindow(window: ZoneSensorWindow): ZoneSensorWindow {
  return {
    ...window,
    sensorQuality: {
      status: "DEGRADED",
      missingSignals: ["movement"],
      lastValidTimestamp: window.samples.at(-1)!.timestamp
    }
  };
}

function headlineFor(decision: ZoneDecision): string {
  if (decision.action === "WARM") return "这里可能需要暖一点";
  if (decision.action === "COOL") return "这里可能需要凉一点";
  return "刚刚好";
}

export function createDemoExperience() {
  const tonightObservation = PHASE_2_SCENARIO_DATASET.observations.find(({ id }) => id === "opposite-zones")!;
  const kneeVector = featureVector(
    tonightObservation.windows.knee_leg,
    tonightObservation.profile.zoneBaselines.knee_leg.localSkinTemp,
    tonightObservation.context.timeOfNight
  );
  const historyFeedback = fiveNightHistory(tonightObservation.userId, kneeVector);
  const tonightHistory: DecisionHistory = { feedback: historyFeedback, interventions: [] };
  const decisions = BODY_ZONES.map((zone) => decideForZone(
    tonightObservation.profile,
    tonightObservation.windows[zone],
    tonightObservation.context,
    tonightHistory
  ));
  const bodyByZone = Object.fromEntries(decisions.map((decision) => [decision.zone, decision])) as Record<BodyZone, ZoneDecision>;
  const controlByZone = Object.fromEntries(decisions.map((decision) => [decision.zone, {
    decision,
    command: generateThermalControlCommand(decision, PROTOTYPE_ACTUATOR_CAPABILITY)
  }])) as Record<BodyZone, ZoneControlPresentation>;
  const technicalByZone = Object.fromEntries(BODY_ZONES.map((zone) => {
    const window = tonightObservation.windows[zone];
    const currentVector = featureVector(
      window,
      tonightObservation.profile.zoneBaselines[zone].localSkinTemp,
      tonightObservation.context.timeOfNight
    );
    const calibration = calibrateFromFeedback(tonightObservation.userId, zone, historyFeedback, currentVector);
    return [zone, {
      window,
      features: extractZoneFeatures(window),
      similarEpisodes: calibration.feedbackCount,
      rawReasons: bodyByZone[zone].reasons.map(({ code }) => code)
    }];
  })) as unknown as Record<BodyZone, {
    window: ZoneSensorWindow;
    features: ReturnType<typeof extractZoneFeatures>;
    similarEpisodes: number;
    rawReasons: readonly string[];
  }>;

  const feedbackObservation = PHASE_2_SCENARIO_DATASET.observations.find(({ id }) => id === "personal-borderline")!;
  const initialHistory: DecisionHistory = { feedback: feedbackObservation.history.feedback.slice(0, 1), interventions: [] };
  const preview = (zone: BodyZone): ZoneDecision => decideForZone(
    feedbackObservation.profile,
    feedbackObservation.windows[zone],
    feedbackObservation.context,
    initialHistory
  );
  const submitAndRerun = (zone: BodyZone, label: UserThermalLabel): ZoneDecision => {
    const seedEpisode = initialHistory.feedback.find((entry) => entry.zone === zone && entry.featureVector);
    const feedback: ThermalFeedback = {
      userId: feedbackObservation.userId,
      zone,
      label,
      recordedAt: feedbackObservation.timestamp,
      ...(seedEpisode?.featureVector ? { featureVector: seedEpisode.featureVector } : {})
    };
    return decideForZone(
      feedbackObservation.profile,
      feedbackObservation.windows[zone],
      feedbackObservation.context,
      { feedback: [...initialHistory.feedback, feedback], interventions: [] }
    );
  };

  const degradedDecision = decideForZone(
    feedbackObservation.profile,
    degradedWindow(feedbackObservation.windows.knee_leg),
    feedbackObservation.context,
    { feedback: [], interventions: [] }
  );
  const attentionZones = decisions.filter(({ action }) => action !== "HOLD").map(({ zone }) => zone);
  const personalizationBefore = preview("knee_leg");
  const personalizationAfter = submitAndRerun("knee_leg", "暖一点");
  const historyCalibration = calibrateFromFeedback(
    tonightObservation.userId,
    "knee_leg",
    historyFeedback,
    kneeVector
  );

  return {
    tonight: {
      time: "23:48",
      ambientTemp: 24.1,
      ambientHumidity: 52,
      userName: "林岚",
      evidenceLabel: "Prototype Simulation" as const
    },
    body: {
      decisions,
      byZone: bodyByZone,
      summary: "今晚整体很稳定",
      attentionZones
    },
    explain(zone: BodyZone): ZoneExplanation {
      const decision = bodyByZone[zone];
      return {
        headline: headlineFor(decision),
        reasons: decision.reasons.map(({ message }) => message),
        contextReasons: ["房间整体变化不大，所以先不调整整张床。"]
      };
    },
    actuatorCapability: PROTOTYPE_ACTUATOR_CAPABILITY,
    control: { byZone: controlByZone },
    technical: { byZone: technicalByZone },
    timeline: [
      { time: "01:42", detail: "膝腿开始慢慢变凉" },
      { time: "01:57", detail: "轻轻暖了一下" },
      { time: "02:05", detail: "回到刚刚好" },
      { time: "03:26", detail: "身体位置变化，数据暂时不够稳定" },
      { time: "03:26", detail: "没有继续调整" }
    ],
    feedback: { preview, submitAndRerun },
    personalization: {
      before: personalizationBefore,
      after: personalizationAfter,
      minimumSamples: 2,
      confidenceCap: 0.14,
      historySummary: {
        similarEpisodeCount: historyCalibration.feedbackCount,
        labelCounts: { "暖一点": 4, "刚刚好": 1, "凉一点": 0 }
      }
    },
    validation: runPhase2Validation(),
    sensorDegraded: {
      decision: degradedDecision,
      command: generateThermalControlCommand(degradedDecision, PROTOTYPE_ACTUATOR_CAPABILITY)
    }
  };
}

export type DemoExperience = ReturnType<typeof createDemoExperience>;
