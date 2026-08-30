import React, { useEffect, useState } from 'react'
import { evaluateZone, titieApi } from '../../services/titieApi.js'

const STRATEGY_LABELS = {
  'fixed-whole-bed': '整床恒温',
  'fixed-zone-threshold': '固定分区',
  'titie-personalized': '体贴',
}

const METRIC_LABELS = {
  preferenceMatch: '和个人偏好一致',
  unnecessaryIntervention: '不必要调整',
  wholeBedOvercorrection: '整床过度调整',
  directionReversal: '方向反转',
}

export function formatValidationRate(metric) {
  const rate = typeof metric === 'number' ? metric : metric?.rate
  return Number.isFinite(rate) ? `${(rate * 100).toFixed(1)}%` : '—'
}

function formatDiagnostic(value, unit = '', digits = 3) {
  return Number.isFinite(value) ? `${value.toFixed(digits)}${unit}` : '—'
}

function commandSummary(command) {
  if (!command) return '—'
  return `${command.direction} · level ${command.level} · ${command.durationMinutes} min`
}

function DecisionExample({ decision }) {
  const diagnostics = decision.diagnostics || {}
  return <section className="stat-card validation-decision">
    <div className="stat-lead">实时决策示例</div>
    <div className="stat-row"><span className="stat-l">Zone</span><span className="stat-v">{decision.zone}</span></div>
    <div className="stat-row"><span className="stat-l">Sensor Quality</span><span className="stat-v">{decision.sensorQuality}</span></div>
    <div className="stat-row"><span className="stat-l">Confidence</span><span className="stat-v">{Math.round(decision.confidence * 100)}%</span></div>
    <div className="stat-row"><span className="stat-l">Engine Action</span><span className="stat-v">{decision.action}</span></div>
    <div className="stat-row"><span className="stat-l">ControlCommand</span><span className="stat-v">{commandSummary(decision.controlCommand)}</span></div>
    <div className="stat-row"><span className="stat-l">Reevaluate</span><span className="stat-v">{decision.reevaluateAfterMinutes} min</span></div>
    <div className="validation-subhead">Diagnostics</div>
    <div className="stat-row"><span className="stat-l">skin temp slope</span><span className="stat-v">{formatDiagnostic(diagnostics.skinTempSlopePerMinute, '°C/min')}</span></div>
    <div className="stat-row"><span className="stat-l">humidity slope</span><span className="stat-v">{formatDiagnostic(diagnostics.humiditySlopePerMinute, '%/min')}</span></div>
    <div className="stat-row"><span className="stat-l">zone-to-body delta</span><span className="stat-v">{formatDiagnostic(diagnostics.zoneToBodyDelta, '°C', 2)}</span></div>
    <div className="stat-row"><span className="stat-l">similar episode count</span><span className="stat-v">{diagnostics.similarEpisodeCount ?? 0}</span></div>
    <div className="validation-subhead">Reason Codes</div>
    <div className="reason-code-list">{decision.reasons.map(({ code }) => <span key={code}>{code}</span>)}</div>
    <span className="sim-badge"><span className="sb-dot2" />Prototype Simulation</span>
  </section>
}

export default function ValidationScreen({ initialReport = null, initialDecision = null } = {}) {
  const [report, setReport] = useState(initialReport)
  const [decision, setDecision] = useState(initialDecision)
  const [failed, setFailed] = useState(false)
  const [decisionFailed, setDecisionFailed] = useState(false)
  useEffect(() => {
    if (!initialReport) titieApi.getValidation().then(setReport).catch(() => setFailed(true))
    if (!initialDecision) evaluateZone('knee').then(setDecision).catch(() => setDecisionFailed(true))
  }, [initialDecision, initialReport])
  return <div className="validation-screen">
    <div className="page-head"><div className="ph-title">技术验证</div></div>
    <p className="validation-boundary">Prototype Simulation — 用于验证控制策略，不代表真实人体或临床效果。</p>
    {report?.reports?.map((item) => <div className="stat-card validation-card" key={item.strategyId}>
      <div className="stat-lead">{STRATEGY_LABELS[item.strategyId] || item.strategyId}</div>
      {Object.entries(item.metrics).map(([key, value]) => <div className="stat-row" key={key}><span className="stat-l">{METRIC_LABELS[key] || key}</span><span className="stat-v">{formatValidationRate(value)}</span></div>)}
      <div className="stat-row"><span className="stat-l">个人反馈带来的改善</span><span className="stat-v">{formatValidationRate(item.personalizationGain)}</span></div>
    </div>)}
    {!report && <div className="stat-foot">{failed ? '验证 API 暂不可用。' : '正在读取验证结果…'}</div>}
    {decision && <DecisionExample decision={decision} />}
    {!decision && <div className="stat-foot">{decisionFailed ? '实时决策示例暂不可用。' : '正在读取实时决策示例…'}</div>}
  </div>
}
