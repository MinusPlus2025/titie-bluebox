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

export function formatValidationMetric(metric) {
  if (typeof metric === 'object' && metric && Number.isFinite(metric.numerator) && Number.isFinite(metric.denominator)) {
    return `${metric.numerator}/${metric.denominator} · ${formatValidationRate(metric)}`
  }
  return formatValidationRate(metric)
}

export function formatValidationGain(value) {
  return Number.isFinite(value) ? `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)} 个百分点` : '—'
}

export default function ValidationScreen({ initialReport = null } = {}) {
  const [report, setReport] = useState(initialReport)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!initialReport) titieApi.getValidation().then(setReport).catch(() => setFailed(true))
  }, [initialReport])
  const observationCount = report?.reports?.[0]?.observationCount
  const decisionCount = Number.isFinite(observationCount) ? observationCount * 6 : null
  return <div className="validation-screen" aria-busy={!report}>
    <div className="page-head"><div className="ph-title">调节方式对比</div></div>
    <p className="validation-boundary"><strong>演示结果</strong> — 仅用于比较不同调节方式，不代表真实人体或实际使用效果。</p>
    {observationCount && <div className="validation-scope" role="note">
      <strong>固定演示场景</strong>
      <span>{observationCount}个演示场景 · {decisionCount}次分区判断 · 三种方式使用相同场景</span>
      <span>这些结果只用于产品演示，不能代表现实人群表现。</span>
    </div>}
    {report?.reports?.map((item) => <div className="stat-card validation-card" key={item.strategyId}>
      <div className="stat-lead">{STRATEGY_LABELS[item.strategyId] || item.strategyId}</div>
      {['preferenceMatch', 'unnecessaryIntervention'].map((key) => <div className="stat-row" key={key}><span className="stat-l">{METRIC_LABELS[key]}</span><span className="stat-v">{formatValidationMetric(item.metrics[key])}</span></div>)}
      <div className="stat-row"><span className="stat-l">个人反馈带来的改善</span><span className="stat-v">{item.strategyId === 'titie-personalized' ? formatValidationGain(item.personalizationGain) : '—'}</span></div>
    </div>)}
    {report && <details className="validation-definitions">
      <summary>查看指标说明</summary>
      <div>和个人偏好一致：建议与演示偏好相同的比例。</div>
      <div>不必要调整：偏好标签为“刚刚好”时仍执行暖或凉的比例。</div>
      <div>个人反馈带来的改善：体贴相对固定分区策略增加的百分点。</div>
    </details>}
    {!report && <div className="stat-foot" role="status">{failed ? '暂时无法查看对比结果。' : '正在准备对比结果…'}</div>}
  </div>
}
