import { BODY_ZONES, type BodyZone, type ThermalAction } from "../domain/thermal.js";
import { decideForBody } from "../engine/thermal-preference-engine.js";
import type { ValidationPrediction, ValidationStrategy, ValidationStrategyInput } from "./types.js";

const WHOLE_BED_WARM_BELOW = 32.8;
const WHOLE_BED_COOL_ABOVE = 33.6;
const ZONE_WARM_BELOW = 32.8;
const ZONE_COOL_ABOVE = 33.6;

function thresholdAction(value: number, warmBelow: number, coolAbove: number): ThermalAction {
  if (value < warmBelow) return "WARM";
  if (value > coolAbove) return "COOL";
  return "HOLD";
}

function latestSkin(observation: ValidationStrategyInput, zone: BodyZone): number {
  return observation.windows[zone].samples.at(-1)!.localSkinTemp;
}

function prediction(
  observation: ValidationStrategyInput,
  actions: Readonly<Record<BodyZone, ThermalAction>>
): ValidationPrediction {
  return {
    observationId: observation.id,
    userId: observation.userId,
    timestamp: observation.timestamp,
    actions
  };
}

export const fixedWholeBedStrategy: ValidationStrategy = {
  id: "fixed-whole-bed",
  scope: "WHOLE_BED",
  predict(observation) {
    const averageSkin = BODY_ZONES.reduce((sum, zone) => sum + latestSkin(observation, zone), 0) / BODY_ZONES.length;
    const action = thresholdAction(averageSkin, WHOLE_BED_WARM_BELOW, WHOLE_BED_COOL_ABOVE);
    return prediction(observation, Object.fromEntries(BODY_ZONES.map((zone) => [zone, action])) as Record<BodyZone, ThermalAction>);
  }
};

export const fixedZoneThresholdStrategy: ValidationStrategy = {
  id: "fixed-zone-threshold",
  scope: "ZONE",
  predict(observation) {
    return prediction(observation, Object.fromEntries(BODY_ZONES.map((zone) => [
      zone,
      thresholdAction(latestSkin(observation, zone), ZONE_WARM_BELOW, ZONE_COOL_ABOVE)
    ])) as Record<BodyZone, ThermalAction>);
  }
};

export const titiePersonalizedStrategy: ValidationStrategy = {
  id: "titie-personalized",
  scope: "ZONE",
  predict(observation) {
    const decisions = decideForBody(
      observation.profile,
      observation.windows,
      observation.context,
      observation.history
    );
    return prediction(observation, Object.fromEntries(decisions.map(({ zone, action }) => [zone, action])) as Record<BodyZone, ThermalAction>);
  }
};

export const PHASE_2_VALIDATION_STRATEGIES = [
  fixedWholeBedStrategy,
  fixedZoneThresholdStrategy,
  titiePersonalizedStrategy
] as const;
