import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DemoApp } from "../src/app/demo-app.js";
import { createDemoExperience } from "../src/app/demo-experience.js";
import { SleepBodyView, TechnicalValidation, ZoneDetailDrawer } from "../src/app/screens.js";

describe("Phase 3 reconstructed product UI", () => {
  it("uses only the three approved top-level tabs and opens on Tonight", () => {
    const html = renderToStaticMarkup(<DemoApp experience={createDemoExperience()} />);

    expect(html).toContain("体贴");
    expect(html).toContain("今晚");
    expect(html).toContain("早晨反馈");
    expect(html).toContain("技术验证");
    expect(html).toContain("知冷暖，好好睡。");
    expect(html).toContain("titie-logo-mark");
    expect(html).toContain("topbar");
    expect(html).toContain("今晚整体很稳定");
    expect(html).not.toContain("progress-nav");
  });

  it("renders a clickable six-zone sleeping body instead of the standing body", () => {
    const experience = createDemoExperience();
    const html = renderToStaticMarkup(<SleepBodyView experience={experience} selectedZone="knee_leg" onSelect={() => undefined} />);

    expect(html).toContain("aria-label=\"俯视睡眠身体区域\"");
    expect(html).toContain("枕头");
    expect(html).toContain("被子");
    expect((html.match(/data-zone=/g) ?? [])).toHaveLength(6);
  });

  it("keeps engine evidence and control command inside the zone drawer", () => {
    const experience = createDemoExperience();
    const html = renderToStaticMarkup(<ZoneDetailDrawer experience={experience} zone="knee_leg" mode="normal" onClose={() => undefined} onModeChange={() => undefined} />);

    expect(html).toContain("建议暖一点");
    expect(html).toContain("轻轻暖一下");
    expect(html).toContain("约8分钟 · 5分钟后再判断");
    expect(html).toContain("查看判断依据");
    expect(html).toContain("sensorQuality");
    expect(html).toContain("zone-to-body delta");
  });

  it("shows the productized degraded state without an error alarm", () => {
    const experience = createDemoExperience();
    const html = renderToStaticMarkup(<ZoneDetailDrawer experience={experience} zone="knee_leg" mode="degraded" onClose={() => undefined} onModeChange={() => undefined} />);

    expect(html).toContain("先不调整，继续观察");
    expect(html).toContain("这里的接触数据暂时不够稳定");
    expect(html).not.toContain("error");
  });

  it("leads validation with three product-facing metrics and keeps the full report folded", () => {
    const html = renderToStaticMarkup(<TechnicalValidation experience={createDemoExperience()} />);

    expect(html).toContain("和个人偏好一致");
    expect(html).toContain("不必要调整");
    expect(html).toContain("个人反馈带来的改善");
    expect(html).toContain("查看完整验证");
    expect(html).toContain("原型模拟结果");
    expect(html).toContain("为什么不是一个温度？");
  });

  it("renders the BlueBox V2 surface contract without replacing real outputs", () => {
    const experience = createDemoExperience();
    const html = renderToStaticMarkup(<DemoApp experience={experience} />);

    expect(html).toContain("bluebox-v2");
    expect(html).toContain(`${experience.tonight.ambientTemp}°C`);
    expect(html).toContain(`${experience.tonight.ambientHumidity}%`);
    expect(html).toContain(`${experience.control.byZone.knee_leg.command.durationMinutes}分钟`);
    expect(html).toContain("Prototype Simulation");
  });
});
