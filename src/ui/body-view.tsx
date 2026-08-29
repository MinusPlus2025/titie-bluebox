import type { BodyZone, ZoneDecision } from "../domain/thermal.js";

export interface BodyViewProps {
  decisions: readonly ZoneDecision[];
}

const ZONE_LABELS: Record<BodyZone, string> = {
  head_neck: "头颈",
  shoulder_back: "肩背",
  waist_abdomen: "腰腹",
  thigh: "大腿",
  knee_leg: "膝腿",
  foot: "足部"
};

const QUALITY_LABELS = {
  GOOD: "信号可用",
  DEGRADED: "信号有所下降",
  INVALID: "信号不可用"
} as const;

function ZoneStatus({ decision }: { decision: ZoneDecision }) {
  const confidencePercent = Math.round(decision.confidence * 100);
  return (
    <article aria-labelledby={`zone-${decision.zone}`}>
      <header>
        <h2 id={`zone-${decision.zone}`}>{ZONE_LABELS[decision.zone]}</h2>
        <output>{decision.userLabel}</output>
      </header>
      <dl>
        <div>
          <dt>置信度</dt>
          <dd>
            <meter
              min={0}
              max={1}
              value={decision.confidence}
              aria-label={`置信度 ${confidencePercent}%`}
            >
              {confidencePercent}%
            </meter>
            <span> {confidencePercent}%</span>
          </dd>
        </div>
        <div>
          <dt>传感状态</dt>
          <dd>{QUALITY_LABELS[decision.sensorQuality]}</dd>
        </div>
      </dl>
      <h3>为什么</h3>
      <ul>
        {decision.reasons.map((reason, index) => (
          <li key={`${reason.code}-${index}`}>{reason.message}</li>
        ))}
      </ul>
    </article>
  );
}

export function BodyView({ decisions }: BodyViewProps) {
  return (
    <main>
      <header>
        <h1>身体状态</h1>
        <p>哪里需要暖一点，哪里需要凉一点，哪里刚刚好。</p>
      </header>

      <aside aria-label="模拟数据说明">
        <strong>Prototype Simulation</strong>
        <p>当前为合成传感数据与模拟调节，不是临床或实地验证。</p>
      </aside>

      {decisions.length === 0 ? (
        <section aria-labelledby="body-state-empty">
          <h2 id="body-state-empty">正在等待可用的区域信号</h2>
          <p>暂时不调节，继续观察。</p>
        </section>
      ) : (
        <ol aria-label="六个身体区域的温感状态">
          {decisions.map((decision) => (
            <li key={decision.zone}>
              <ZoneStatus decision={decision} />
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
