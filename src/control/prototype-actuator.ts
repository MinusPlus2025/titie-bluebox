import type { ActuatorCapability } from "../domain/control.js";

export const PROTOTYPE_ACTUATOR_CAPABILITY: ActuatorCapability = {
  actuatorId: "prototype-mattress-v1",
  zones: {
    head_neck: { directions: ["HEAT", "COOL"], maxLevel: 1, maxDurationMinutes: 8 },
    shoulder_back: { directions: ["HEAT", "COOL"], maxLevel: 1, maxDurationMinutes: 5 },
    waist_abdomen: { directions: ["HEAT", "COOL"], maxLevel: 2, maxDurationMinutes: 10 },
    thigh: { directions: ["HEAT", "COOL"], maxLevel: 2, maxDurationMinutes: 10 },
    knee_leg: { directions: ["HEAT", "COOL"], maxLevel: 2, maxDurationMinutes: 8 },
    foot: { directions: ["HEAT"], maxLevel: 2, maxDurationMinutes: 8 }
  }
};
