import { useState } from "react";
import type { BodyZone } from "../domain/thermal.js";
import type { DemoExperience } from "./demo-experience.js";
import { MorningFeedback, TechnicalValidation, Tonight, TopNav, type DemoTab, type SensorDemoMode, ZoneDetailDrawer } from "./screens.js";

export function DemoApp({ experience }: { experience: DemoExperience }) {
  const [tab, setTab] = useState<DemoTab>(() =>
    typeof window !== "undefined" && window.location.pathname === "/validation" ? "validation" : "tonight"
  );
  const [zone, setZone] = useState<BodyZone>("knee_leg");
  const [drawer, setDrawer] = useState(false);
  const [mode, setMode] = useState<SensorDemoMode>("normal");
  return <div className="app-shell bluebox-v2"><a className="skip-link" href="#content">跳到主要内容</a><TopNav active={tab} onChange={(next) => { setTab(next); setDrawer(false); }}/><div id="content">{tab === "tonight" ? <Tonight experience={experience} selectedZone={zone} onSelect={setZone} onOpenDrawer={() => setDrawer(true)}/> : tab === "morning" ? <MorningFeedback experience={experience}/> : <TechnicalValidation experience={experience}/>}</div>{drawer ? <><button className="drawer-scrim" aria-label="关闭详情" onClick={() => setDrawer(false)}/><ZoneDetailDrawer experience={experience} zone={zone} mode={mode} onClose={() => setDrawer(false)} onModeChange={setMode}/></> : null}</div>;
}
