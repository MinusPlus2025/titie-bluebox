import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BodyView } from "../src/ui/body-view.js";
import type { BodyZone, ZoneDecision } from "../src/domain/thermal.js";

const zoneLabels: Record<BodyZone, string> = {
  head_neck: "头颈",
  shoulder_back: "肩背",
  waist_abdomen: "腰腹",
  thigh: "大腿",
  knee_leg: "膝腿",
  foot: "足部"
};

const decisions = (Object.keys(zoneLabels) as BodyZone[]).map((zone, index): ZoneDecision => ({
  zone,
  action: index === 1 ? "COOL" : index === 4 ? "WARM" : "HOLD",
  userLabel: index === 1 ? "凉一点" : index === 4 ? "暖一点" : "刚刚好",
  intensity: index === 1 || index === 4 ? 1 : 0,
  durationMinutes: index === 1 || index === 4 ? 8 : 0,
  confidence: 0.72,
  reasons: [{ code: "STABLE_LOCAL_STATE", message: `${zoneLabels[zone]}当前状态说明` }],
  reevaluateAfterMinutes: 5,
  simulation: true,
  evidenceLabel: "Prototype Simulation",
  sensorQuality: "GOOD"
}));

describe("BodyView skeleton", () => {
  it("renders all six named zones, decisions, reasons, and simulation boundary semantically", () => {
    const html = renderToStaticMarkup(<BodyView decisions={decisions} />);

    expect(html).toContain("<main");
    expect(html).toContain("身体状态");
    expect(html).toContain("Prototype Simulation");
    for (const label of Object.values(zoneLabels)) expect(html).toContain(label);
    expect(html).toContain("暖一点");
    expect(html).toContain("刚刚好");
    expect(html).toContain("凉一点");
    expect(html).toContain("aria-label=\"置信度 72%\"");
    expect(html).toContain("膝腿当前状态说明");
  });

  it("shows a quiet empty state when no zone decision is available", () => {
    const html = renderToStaticMarkup(<BodyView decisions={[]} />);

    expect(html).toContain("正在等待可用的区域信号");
    expect(html).toContain("暂时不调节，继续观察");
  });
});
