import { describe, expect, it } from "vitest";

import { evaluationPayload, feedbackPayload, ZONE_KEY_MAP } from "../src/services/titieApi.js";
import { engineSheet } from "../src/eazo/data/engine-view.js";
import { evaluateThermalPreference } from "../src/api/services.js";

const fallback = {
  region: "膝腿",
  dir: "暖一点",
  lead: ["fallback"],
  action: { text: "正在暖一点", time: "约8分钟" },
  hint: "5分钟后再看看。",
  evidence: []
};

describe("Eazo frontend integration", () => {
  it("uses the approved six-zone backend mapping", () => {
    expect(ZONE_KEY_MAP).toEqual({
      neck: "head_neck", shoulder: "shoulder_back", waist: "waist_abdomen",
      thigh: "thigh", knee: "knee_leg", foot: "foot"
    });
  });

  it("sends feedback labels through the existing personalization contract", () => {
    expect(feedbackPayload("warm").label).toBe("暖一点");
    expect(feedbackPayload("steady").label).toBe("刚刚好");
    expect(feedbackPayload("cool").label).toBe("凉一点");
  });

  it("builds the turn demo from a real DEGRADED engine response", () => {
    const decision = evaluateThermalPreference(evaluationPayload("knee", "DEGRADED"));
    expect(decision).toMatchObject({ sensorQuality: "DEGRADED", action: "HOLD", intensity: 0, durationMinutes: 0 });
    const sheet = engineSheet(decision, fallback);
    expect(sheet.dir).toBe("先不调整，继续观察");
    expect(sheet.lead.join(" ")).toContain("部分传感信号不够稳定");
  });

  it("renders INVALID as a safe stop using the same engine decision", () => {
    const decision = evaluateThermalPreference(evaluationPayload("knee", "INVALID"));
    expect(decision).toMatchObject({ sensorQuality: "INVALID", action: "HOLD", intensity: 0, durationMinutes: 0 });
    expect(engineSheet(decision, fallback).lead.join(" ")).toContain("安全停止调节");
  });
});
