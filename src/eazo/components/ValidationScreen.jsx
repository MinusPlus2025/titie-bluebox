import React, { useEffect, useState } from 'react'
import { titieApi } from '../../services/titieApi.js'

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

export default function ValidationScreen() {
  const [report, setReport] = useState(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => { titieApi.getValidation().then(setReport).catch(() => setFailed(true)) }, [])
  return <div className="validation-screen">
    <div className="page-head"><div className="ph-title">技术验证</div></div>
    <p className="validation-boundary">Prototype Simulation — 用于验证控制策略，不代表真实人体或临床效果。</p>
    {report?.reports?.map((item) => <div className="stat-card validation-card" key={item.strategyId}>
      <div className="stat-lead">{STRATEGY_LABELS[item.strategyId] || item.strategyId}</div>
      {Object.entries(item.metrics).map(([key, value]) => <div className="stat-row" key={key}><span className="stat-l">{METRIC_LABELS[key] || key}</span><span className="stat-v">{formatValidationRate(value)}</span></div>)}
      <div className="stat-row"><span className="stat-l">个人反馈带来的改善</span><span className="stat-v">{formatValidationRate(item.personalizationGain)}</span></div>
    </div>)}
    {!report && <div className="stat-foot">{failed ? '验证 API 暂不可用。' : '正在读取验证结果…'}</div>}
  </div>
}
