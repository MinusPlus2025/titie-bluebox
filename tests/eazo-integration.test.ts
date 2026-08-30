import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";

import { evaluationPayload, feedbackPayload, ZONE_KEY_MAP } from "../src/services/titieApi.js";
import { engineSheet } from "../src/eazo/data/engine-view.js";
import { evaluateThermalPreference } from "../src/api/services.js";
import HomeScreen, { BODY_MARKER_POSITIONS } from "../src/eazo/components/HomeScreen.jsx";
import RegionSheet from "../src/eazo/components/RegionSheet.jsx";
import FeedbackScreen from "../src/eazo/components/FeedbackScreen.jsx";
import SleepScreen from "../src/eazo/components/SleepScreen.jsx";
import { feedback, feedbackRegions, mePanels, monthStats, regions, sessions, weekStats } from "../src/eazo/data/content.js";
import ValidationScreen, { formatValidationGain, formatValidationMetric, formatValidationRate } from "../src/eazo/components/ValidationScreen.jsx";

const fallback = {
  region: "膝腿",
  dir: "暖一点",
  lead: ["fallback"],
  action: { text: "正在暖一点", time: "约8分钟" },
  hint: "5分钟后再看看。",
  evidence: []
};

describe("Eazo frontend integration", () => {
  it("uses natural night-based Chinese across sleep history and feedback", () => {
    const sleepHtml = renderToStaticMarkup(createElement(SleepScreen, { onOpenFeedback: () => undefined }));
    const feedbackHtml = renderToStaticMarkup(createElement(FeedbackScreen, { onClose: () => undefined }));
    const ordinaryCopy = JSON.stringify({ sessions, weekStats, monthStats, feedback, mePanels });

    expect(sleepHtml).toContain("夜间记录");
    expect(sleepHtml).toContain("冷暖调节");
    expect(feedbackHtml).toContain("睡醒了。");
    expect(feedbackHtml).toContain("如果再遇到这样的情况，你希望这里？");
    expect(ordinaryCopy).not.toMatch(/这一觉|[0-9]+觉|HOLD|主动干预|Prototype Simulation|Digital Twin|决策系统|温控指令|产品闭环|原型模拟|Hackathon Prototype/);
  });

  it("presents About in user language with a plain product boundary", () => {
    expect(mePanels.about.lines).toEqual([
      "体贴",
      "知冷暖，好好睡。",
      "体贴会参考不同身体位置的变化和你的反馈，看看哪里需要暖一点、凉一点，或保持刚刚好。",
      "它不替所有人设定同一个温度，而是关注你在不同时间、不同位置的冷暖感受。",
      "当前为演示版本，尚未连接真实睡眠设备。页面中的记录和调节均为演示内容。",
      "版本信息",
      "体验版本 · 2026",
    ]);
    expect(mePanels.about.lines.join(" ")).not.toMatch(/决策系统|温控指令|产品闭环|传感数据|原型模拟|Prototype|Simulation|AI智能|更懂女性/);
  });

  it("renders a natural RegionSheet fallback while live evaluation is loading", () => {
    const html = renderToStaticMarkup(createElement(RegionSheet, {
      regionKey: "knee",
      decision: null,
      onClose: () => undefined,
    }));

    expect(html).toContain("为什么暖一点");
    expect(html).not.toMatch(/技术详情|温度变化率|局部与身体温差|置信度|原型模拟|Prototype Simulation/);
  });

  it("anchors the shoulder marker on the visible upper-back area", () => {
    expect(BODY_MARKER_POSITIONS.shoulder).toEqual({ top: "25.5%", left: "76%" });
  });

  it("uses preference language and an always-visible simulation boundary on Home", () => {
    const nightHtml = renderToStaticMarkup(createElement(HomeScreen, {
      degrade: false,
      decisions: { shoulder: { action: "COOL" }, knee: { action: "WARM" } },
      apiFallback: false,
      onOpenRegion: () => undefined,
      onTurn: () => undefined,
      theme: "night",
      onToggleTheme: () => undefined,
    }));
    const dayHtml = renderToStaticMarkup(createElement(HomeScreen, {
      degrade: false,
      decisions: { shoulder: { action: "COOL" }, knee: { action: "WARM" } },
      apiFallback: false,
      onOpenRegion: () => undefined,
      onTurn: () => undefined,
      theme: "day",
      onToggleTheme: () => undefined,
    }));

    expect(nightHtml).toContain("想凉一点");
    expect(nightHtml).toContain("想暖一点");
    expect(nightHtml).toContain("演示数据 · 每5分钟更新一次");
    expect(nightHtml).not.toMatch(/偏热|偏凉|正在监测中/);
    expect(nightHtml).toContain('aria-label="当前夜晚，切换到白天"');
    expect(nightHtml).toContain('<span class="theme-mode-label">夜晚</span>');
    expect(dayHtml).toContain('aria-label="当前白天，切换到夜晚"');
    expect(dayHtml).toContain('<span class="theme-mode-label">白天</span>');
  });

  it("gives overlays, segmented controls, and feedback choices native accessible semantics", () => {
    const regionHtml = renderToStaticMarkup(createElement(RegionSheet, {
      regionKey: "knee",
      decision: null,
      onClose: () => undefined,
    }));
    const sleepHtml = renderToStaticMarkup(createElement(SleepScreen, { onOpenFeedback: () => undefined }));
    const feedbackHtml = renderToStaticMarkup(createElement(FeedbackScreen, { onClose: () => undefined }));

    expect(regionHtml).toContain('role="dialog"');
    expect(regionHtml).toContain('aria-modal="true"');
    expect(regionHtml).toContain('aria-label="关闭区域详情"');
    expect(sleepHtml).toContain('role="tablist"');
    expect(sleepHtml).toContain('aria-selected="true"');
    expect(feedbackHtml).toContain('aria-label="返回睡眠记录"');
    expect(feedbackHtml).toContain('aria-pressed="false"');
  });

  it("includes reduced-motion and keyboard-focus safeguards", () => {
    const css = readFileSync(new URL("../src/eazo/styles.css", import.meta.url), "utf8");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(":focus-visible");
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

  it("keeps HOLD user language separate from all internal diagnostics", () => {
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
    expect(html).not.toMatch(/技术详情|温度变化率|局部与身体温差|相似状态数量|ControlCommand|Engine action|LOW_CONFIDENCE_HOLD|>GOOD<|原型模拟/);
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

  it("keeps raw engineering evidence out of the public validation surface", () => {
    const decision = evaluateThermalPreference(evaluationPayload("knee"));
    const html = renderToStaticMarkup(createElement(ValidationScreen as any, {
      initialDecision: decision,
      initialReport: { reports: [] },
    }));

    expect(html).not.toMatch(/实时决策示例|Sensor Quality|Engine Action|ControlCommand|Reason Codes|Diagnostics|LOCAL_TEMP_FALLING|Prototype Simulation|WARM|HOLD|COOL/);
    expect(html).toContain("演示结果");
  });

  it("formats the Validation Runner rate object instead of rendering NaN", () => {
    expect(formatValidationRate({ numerator: 23, denominator: 30, rate: 0.7667 })).toBe("76.7%");
    expect(formatValidationRate(0.0333)).toBe("3.3%");
    expect(formatValidationMetric({ numerator: 30, denominator: 30, rate: 1 })).toBe("30/30 · 100.0%");
    expect(formatValidationGain(0.0333)).toBe("+3.3 个百分点");
  });

  it("states the fixed synthetic validation scope instead of presenting a generic accuracy claim", () => {
    const report = {
      datasetId: "phase-2-synthetic-v1",
      reports: [{
        strategyId: "titie-personalized",
        observationCount: 5,
        metrics: {
          preferenceMatch: { numerator: 30, denominator: 30, rate: 1 },
          unnecessaryIntervention: { numerator: 0, denominator: 30, rate: 0 },
          wholeBedOvercorrection: { numerator: 0, denominator: 30, rate: 0 },
          directionReversal: { numerator: 0, denominator: 24, rate: 0 },
        },
        personalizationGain: 0.0333,
      }],
    };
    const html = renderToStaticMarkup(createElement(ValidationScreen as any, { initialReport: report }));

    expect(html).toContain("5个演示场景 · 30次分区判断");
    expect(html).toContain("固定演示场景");
    expect(html).toContain("+3.3 个百分点");
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
