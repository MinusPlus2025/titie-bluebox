import { describe, expect, it } from "vitest";

import { generateThermalControlCommand } from "../src/control/control-command-generator.js";
import type { ActuatorCapability } from "../src/domain/control.js";
import type { ZoneDecision } from "../src/domain/thermal.js";

const decision: ZoneDecision = {
  zone: "knee_leg",
  action: "WARM",
  userLabel: "暖一点",
  intensity: 3,
  durationMinutes: 14,
  confidence: 0.82,
  reasons: [
    { code: "LOCAL_TEMP_BELOW_BASELINE", message: "局部温度低于你的该区基线" },
    { code: "PERSONAL_WARM_PATTERN", message: "这里的状态和过去反馈接近" }
  ],
  reevaluateAfterMinutes: 5,
  simulation: true,
  evidenceLabel: "Prototype Simulation",
  sensorQuality: "GOOD"
};

const capability: ActuatorCapability = {
  actuatorId: "prototype-mattress-v1",
  zones: {
    knee_leg: { directions: ["HEAT", "COOL"], maxLevel: 2, maxDurationMinutes: 10 },
    foot: { directions: ["HEAT"], maxLevel: 1, maxDurationMinutes: 8 }
  }
};

describe("ThermalControlCommand contract", () => {
  it("maps a supported decision and applies actuator caps", () => {
    expect(generateThermalControlCommand(decision, capability)).toEqual({
      zone: "knee_leg",
      direction: "HEAT",
      level: 2,
      durationMinutes: 10,
      reevaluateAfterMinutes: 5,
      confidence: 0.82,
      reasonCodes: ["LOCAL_TEMP_BELOW_BASELINE", "PERSONAL_WARM_PATTERN", "ACTUATOR_LIMIT_APPLIED"],
      simulation: true,
      evidenceLabel: "Prototype Simulation"
    });
  });

  it("safely holds when the actuator does not support the requested zone", () => {
    const command = generateThermalControlCommand({ ...decision, zone: "shoulder_back" }, capability);

    expect(command.direction).toBe("HOLD");
    expect(command.level).toBe(0);
    expect(command.durationMinutes).toBe(0);
    expect(command.reasonCodes.at(-1)).toBe("ACTUATOR_ZONE_UNSUPPORTED");
  });

  it("safely holds when a zone cannot execute the requested direction", () => {
    const command = generateThermalControlCommand({
      ...decision,
      zone: "foot",
      action: "COOL",
      userLabel: "凉一点"
    }, capability);

    expect(command.direction).toBe("HOLD");
    expect(command.reasonCodes.at(-1)).toBe("ACTUATOR_DIRECTION_UNSUPPORTED");
  });

  it("preserves an intelligent HOLD without requiring actuator support", () => {
    const command = generateThermalControlCommand({
      ...decision,
      zone: "head_neck",
      action: "HOLD",
      userLabel: "刚刚好",
      intensity: 0,
      durationMinutes: 0
    }, capability);

    expect(command).toMatchObject({ direction: "HOLD", level: 0, durationMinutes: 0 });
    expect(command.reasonCodes).not.toContain("ACTUATOR_ZONE_UNSUPPORTED");
  });
});
