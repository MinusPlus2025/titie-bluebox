import type { BodyZone, DecisionReason, PersonalizationFeatureVector, ThermalFeedback } from "../domain/thermal.js";

export interface PersonalCalibration {
  directionalBias: number;
  feedbackCount: number;
  confidenceAdjustment: number;
  reasons: readonly DecisionReason[];
}

const TOP_K = 5;
const MINIMUM_EPISODES = 2;
const MINIMUM_SIMILARITY = 0.55;

function normalizedDelta(left: number, right: number, scale: number): number {
  return Math.min(1, Math.abs(left - right) / scale);
}

export function episodeSimilarity(
  current: PersonalizationFeatureVector,
  historical: PersonalizationFeatureVector
): number {
  const distance =
    normalizedDelta(current.localTempDeviation, historical.localTempDeviation, 1.5) * 0.3
    + normalizedDelta(current.skinTempSlopePerMinute, historical.skinTempSlopePerMinute, 0.1) * 0.25
    + normalizedDelta(current.localHumidity, historical.localHumidity, 20) * 0.15
    + normalizedDelta(current.humiditySlopePerMinute, historical.humiditySlopePerMinute, 1) * 0.1
    + normalizedDelta(current.zoneToBodyDelta, historical.zoneToBodyDelta, 1.5) * 0.1
    + (current.timeOfNight === historical.timeOfNight ? 0 : 0.05)
    + (current.sleepStage === historical.sleepStage ? 0 : 0.05);
  return Number(Math.max(0, 1 - distance).toFixed(4));
}

export function calibrateFromFeedback(
  userId: string,
  zone: BodyZone,
  feedback: readonly ThermalFeedback[],
  currentFeatures: PersonalizationFeatureVector
): PersonalCalibration {
  const matches = feedback
    .filter((entry) => entry.userId === userId && entry.zone === zone && entry.featureVector)
    .map((entry) => ({ entry, similarity: episodeSimilarity(currentFeatures, entry.featureVector!) }))
    .filter(({ similarity }) => similarity >= MINIMUM_SIMILARITY)
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, TOP_K);
  const totalSimilarity = matches.reduce((sum, match) => sum + match.similarity, 0);
  const labelScore = matches.reduce((sum, { entry, similarity }) => {
    if (entry.label === "暖一点") return sum + similarity;
    if (entry.label === "凉一点") return sum - similarity;
    return sum;
  }, 0);
  const agreement = totalSimilarity === 0 ? 0 : Math.abs(labelScore / totalSimilarity);
  const averageSimilarity = matches.length === 0 ? 0 : totalSimilarity / matches.length;
  const directionalBias = matches.length < MINIMUM_EPISODES
    ? 0
    : Math.max(-0.6, Math.min(0.6, (labelScore / totalSimilarity) * 0.6 * averageSimilarity));
  const conflictPenalty = matches.length >= MINIMUM_EPISODES && agreement < 0.5
    ? (1 - agreement) * 0.12
    : 0;
  const confidenceAdjustment = matches.length < MINIMUM_EPISODES
    ? 0
    : Math.min(0.14, matches.length * 0.07 * averageSimilarity) - conflictPenalty;
  const reasons: DecisionReason[] = [];

  if (directionalBias > 0) {
    reasons.push({
        code: "PERSONAL_WARM_PATTERN",
        message: "这里的状态和你过去选择“暖一点”时比较接近"
      });
  } else if (directionalBias < 0) {
    reasons.push({
        code: "PERSONAL_COOL_PATTERN",
        message: "这里的状态和你过去选择“凉一点”时比较接近"
      });
  }
  if (conflictPenalty > 0) {
    reasons.push({
      code: "PERSONAL_FEEDBACK_CONFLICT",
      message: "相似状态下的过去选择存在分歧，已降低判断置信度"
    });
  }
  return { directionalBias, feedbackCount: matches.length, confidenceAdjustment, reasons };
}
