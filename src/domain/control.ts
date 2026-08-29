import type { BodyZone, DecisionReasonCode } from "./thermal.js";

export type ActuatorDirection = "HEAT" | "COOL";
export type ControlDirection = ActuatorDirection | "HOLD";
export type ControlReasonCode = DecisionReasonCode
  | "ACTUATOR_ZONE_UNSUPPORTED"
  | "ACTUATOR_DIRECTION_UNSUPPORTED"
  | "ACTUATOR_LIMIT_APPLIED";

export interface ZoneActuatorCapability {
  directions: readonly ActuatorDirection[];
  maxLevel: 1 | 2 | 3;
  maxDurationMinutes: number;
}

export interface ActuatorCapability {
  actuatorId: string;
  zones: Partial<Record<BodyZone, ZoneActuatorCapability>>;
}

export interface ThermalControlCommand {
  zone: BodyZone;
  direction: ControlDirection;
  level: 0 | 1 | 2 | 3;
  durationMinutes: number;
  reevaluateAfterMinutes: number;
  confidence: number;
  reasonCodes: readonly ControlReasonCode[];
  simulation: true;
  evidenceLabel: "Prototype Simulation";
}
