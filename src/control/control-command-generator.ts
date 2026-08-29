import type {
  ActuatorCapability,
  ActuatorDirection,
  ControlReasonCode,
  ThermalControlCommand
} from "../domain/control.js";
import type { ZoneDecision } from "../domain/thermal.js";

function holdCommand(
  decision: ZoneDecision,
  reasonCodes: readonly ControlReasonCode[]
): ThermalControlCommand {
  return {
    zone: decision.zone,
    direction: "HOLD",
    level: 0,
    durationMinutes: 0,
    reevaluateAfterMinutes: decision.reevaluateAfterMinutes,
    confidence: decision.confidence,
    reasonCodes,
    simulation: true,
    evidenceLabel: "Prototype Simulation"
  };
}

export function generateThermalControlCommand(
  decision: ZoneDecision,
  actuator: ActuatorCapability
): ThermalControlCommand {
  const decisionReasons = decision.reasons.map(({ code }) => code);
  if (decision.action === "HOLD") return holdCommand(decision, decisionReasons);

  const capability = actuator.zones[decision.zone];
  if (!capability) {
    return holdCommand(decision, [...decisionReasons, "ACTUATOR_ZONE_UNSUPPORTED"]);
  }

  const direction: ActuatorDirection = decision.action === "WARM" ? "HEAT" : "COOL";
  if (!capability.directions.includes(direction)) {
    return holdCommand(decision, [...decisionReasons, "ACTUATOR_DIRECTION_UNSUPPORTED"]);
  }

  const level = Math.min(decision.intensity, capability.maxLevel) as 1 | 2 | 3;
  const durationMinutes = Math.min(decision.durationMinutes, capability.maxDurationMinutes);
  const limited = level !== decision.intensity || durationMinutes !== decision.durationMinutes;

  return {
    zone: decision.zone,
    direction,
    level,
    durationMinutes,
    reevaluateAfterMinutes: decision.reevaluateAfterMinutes,
    confidence: decision.confidence,
    reasonCodes: limited ? [...decisionReasons, "ACTUATOR_LIMIT_APPLIED"] : decisionReasons,
    simulation: true,
    evidenceLabel: "Prototype Simulation"
  };
}
