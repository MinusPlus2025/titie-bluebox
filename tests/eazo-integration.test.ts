import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { evaluationPayload, feedbackPayload, ZONE_KEY_MAP } from "../src/services/titieApi.js";
import { engineSheet } from "../src/eazo/data/engine-view.js";
import { evaluateThermalPreference } from "../src/api/services.js";
import { BODY_MARKER_POSITIONS } from "../src/eazo/components/HomeScreen.jsx";
import RegionSheet from "../src/eazo/components/RegionSheet.jsx";
import { feedbackRegions, mePanels, monthStats, regions, sessions, weekStats } from "../src/eazo/data/content.js";
import ValidationScreen, { formatValidationRate } from "../src/eazo/components/ValidationScreen.jsx";

const fallback = {
  region: "膝腿",
  dir: "暖一点",
  lead: ["fallback"],
  action: { text: "正在暖一点", time: "约8分钟" },
  hint: "5分钟后再看看。",
  evidence: []
};

describe("Eazo frontend integration", () => {
  it("anchors the shoulder marker on the visible upper-back area", () => {
    expect(BODY_MARKER_POSITIONS.shoulder).toEqual({ top: "25.5%", left: "76%" });
  });

  it("uses the approved six-zone backend mapping", () => {
    expect(ZONE_KEY_MAP).toEqual({
      neck: "head_neck", shoulder: "shoulder_back", waist: "waist_abdomen",
      thigh: "thigh", knee: "knee_leg", foot: "foot"
    });
  });

  it("exposes all six visible body zones and feedback targets", () => {
    expect(regions.map(({ key }) => key)).toEqual(Object.keys(ZONE_KEY_MAP));
    expect(feedbackRegions).toHaveLength(6);
  });

  it("provides three distinct sessions and real week/month views", () => {
    expect(sessions.map(({ date }) => date)).toEqual(["8月27日", "8月28日", "8月29日"]);
    expect(weekStats.lead).not.toBe(monthStats.lead);
    expect(monthStats.rows.length).toBeGreaterThan(weekStats.rows.length);
  });

  it("provides a response panel for every visible My-page row", () => {
    expect(Object.keys(mePanels)).toEqual([
      "sleep_time", "nap", "cycle", "hot_flash", "exercise", "cosleep", "device", "privacy", "about"
    ]);
  });

  it("sends feedback labels through the existing personalization contract", () => {
    expect(feedbackPayload("warm").label).toBe("暖一点");
    expect(feedbackPayload("steady").label).toBe("刚刚好");
    expect(feedbackPayload("cool").label).toBe("凉一点");
    expect(feedbackPayload("warm", "shoulder").window.zone).toBe("shoulder_back");
    expect(feedbackPayload("steady", "foot").window.zone).toBe("foot");
  });

  it("returns the real control contract and diagnostics to the presentation layer", () => {
    const decision = evaluateThermalPreference(evaluationPayload("shoulder"));
    expect(decision.controlCommand).toMatchObject({ zone: "shoulder_back", direction: "COOL", simulation: true });
    expect(decision.diagnostics).toMatchObject({ similarEpisodeCount: expect.any(Number) });
  });

  it("keeps HOLD user language separate from real technical diagnostics", () => {
    const decision = evaluateThermalPreference(evaluationPayload("neck"));
    expect(decision.action).toBe("HOLD");
    const html = renderToStaticMarkup(createElement(RegionSheet, {
      regionKey: "neck",
      decision,
      onClose: () => undefined,
    }));

    expect(html).toContain('<details class="disclose">');
    expect(html).toContain("为什么先不调");
    expect(html).toContain("数据状态正常");
    expect(html).toContain("技术详情");
    expect(html).toContain("温度变化率");
    expect(html).toContain("局部与身体温差");
    expect(html).not.toContain("ControlCommand");
    expect(html).not.toContain("Engine action");
    expect(html).not.toContain("LOW_CONFIDENCE_HOLD");
    expect(html).not.toContain(">GOOD<");
  });

  it("uses action-specific evidence titles and real reason translations", () => {
    const warm = engineSheet(evaluateThermalPreference(evaluationPayload("knee")), fallback);
    const cool = engineSheet(evaluateThermalPreference(evaluationPayload("shoulder")), fallback);

    expect(warm.evidenceTitle).toBe("为什么暖一点");
    expect(warm.userReasons.join(" ")).toContain("慢慢变凉");
    expect(cool.evidenceTitle).toBe("为什么凉一点");
    expect(cool.userReasons.join(" ")).toContain("慢慢变热");
  });

  it("translates sensor quality and confidence without conflating them", () => {
    const good = engineSheet(evaluateThermalPreference(evaluationPayload("neck")), fallback);
    const degraded = engineSheet(evaluateThermalPreference(evaluationPayload("knee", "DEGRADED")), fallback);
    const invalid = engineSheet(evaluateThermalPreference(evaluationPayload("knee", "INVALID")), fallback);

    expect(good.dataStatus).toBe("数据状态正常");
    expect(good.confidenceLabel).toBe("当前依据不足");
    expect(degraded.dataStatus).toBe("数据暂时不稳定");
    expect(degraded.userReasons.join(" ")).toContain("先继续观察");
    expect(invalid.dataStatus).toBe("当前数据不可用");
    expect(invalid.lead.join(" ")).toContain("已经暂停动作");
  });

  it("keeps engineering evidence on validation instead of the user sheet", () => {
    const decision = evaluateThermalPreference(evaluationPayload("knee"));
    const html = renderToStaticMarkup(createElement(ValidationScreen as any, {
      initialDecision: decision,
      initialReport: { reports: [] },
    }));

    expect(html).toContain("实时决策示例");
    expect(html).toContain("Sensor Quality");
    expect(html).toContain("Engine Action");
    expect(html).toContain("ControlCommand");
    expect(html).toContain("Reason Codes");
    expect(html).toContain("Diagnostics");
    expect(html).toContain("LOCAL_TEMP_FALLING");
    expect(html).toContain("Prototype Simulation");
  });

  it("formats the Validation Runner rate object instead of rendering NaN", () => {
    expect(formatValidationRate({ numerator: 23, denominator: 30, rate: 0.7667 })).toBe("76.7%");
    expect(formatValidationRate(0.0333)).toBe("3.3%");
  });

  it("builds the turn demo from a real DEGRADED engine response", () => {
    const decision = evaluateThermalPreference(evaluationPayload("knee", "DEGRADED"));
    expect(decision).toMatchObject({ sensorQuality: "DEGRADED", action: "HOLD", intensity: 0, durationMinutes: 0 });
    const sheet = engineSheet(decision, fallback);
    expect(sheet.dir).toBe("先不调整，继续观察");
    expect(sheet.dataStatus).toBe("数据暂时不稳定");
    expect(sheet.lead.join(" ")).toContain("先继续观察");
  });

  it("renders INVALID as a safe stop using the same engine decision", () => {
    const decision = evaluateThermalPreference(evaluationPayload("knee", "INVALID"));
    expect(decision).toMatchObject({ sensorQuality: "INVALID", action: "HOLD", intensity: 0, durationMinutes: 0 });
    expect(engineSheet(decision, fallback).lead.join(" ")).toContain("已经暂停动作");
  });
});
