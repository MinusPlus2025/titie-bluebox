export const zoneLabels = {
  head_neck: '头颈', shoulder_back: '肩背', waist_abdomen: '腰腹',
  thigh: '大腿', knee_leg: '膝腿', foot: '足部',
}

export function actionCopy(decision) {
  if (!decision) return '刚刚好'
  if (decision.action === 'WARM') return '暖一点'
  if (decision.action === 'COOL') return '凉一点'
  return '刚刚好'
}

export function actionTone(decision) {
  if (!decision) return 'steady'
  if (decision.action === 'WARM') return 'warm'
  if (decision.action === 'COOL') return 'cool'
  return 'steady'
}

const USER_REASON_COPY = {
  LOCAL_TEMP_BELOW_BASELINE: '这里比你平时的状态更凉一些',
  LOCAL_TEMP_ABOVE_BASELINE: '这里比你平时的状态更热一些',
  LOCAL_TEMP_FALLING: '这里最近在慢慢变凉',
  LOCAL_TEMP_RISING: '这里最近在慢慢变热',
  HUMIDITY_RISING: '这里的湿度正在上升',
  PERSONAL_WARM_PATTERN: '过去遇到相似情况时，你更常选择暖一点',
  PERSONAL_COOL_PATTERN: '过去遇到相似情况时，你更常选择凉一点',
  PERSONAL_FEEDBACK_CONFLICT: '过去相似情况里的选择还不一致',
  LOW_CONFIDENCE_HOLD: '目前还看不出需要调整',
  HYSTERESIS_HOLD: '变化方向还不够稳定，先避免反复调节',
  MINIMUM_INTERVAL_HOLD: '刚刚已经调节过，先观察一会儿',
  SENSOR_QUALITY_DEGRADED: '刚刚的信号还不够稳定，先继续观察',
  SENSOR_DATA_INVALID: '暂时读不到稳定数据，先不调整',
  STABLE_LOCAL_STATE: '这里最近的状态比较稳定',
}

function dataStatusCopy(status) {
  if (status === 'DEGRADED') return '接触信号暂时不稳'
  if (status === 'INVALID') return '暂时没有可用信号'
  return '当前信号稳定'
}

function technicalDataStatus(status) {
  if (status === 'DEGRADED') return '暂时不稳定'
  if (status === 'INVALID') return '不可用'
  return '正常'
}

function confidenceCopy(confidence) {
  if (confidence < 0.6) return '还需要再观察'
  if (confidence < 0.8) return '判断依据比较充分'
  return '判断依据充分'
}

function unique(items) {
  return [...new Set(items.filter(Boolean))]
}

function userReasonsFor(decision) {
  if (decision.sensorQuality === 'DEGRADED') {
    return ['刚刚的信号还不够稳定，先继续观察', '当前不会主动调节']
  }
  if (decision.sensorQuality === 'INVALID') {
    return ['暂时读不到稳定数据，先不调整', '信号恢复稳定前不会主动调节']
  }

  const diagnostics = decision.diagnostics || {}
  const mapped = decision.reasons.map(({ code }) => USER_REASON_COPY[code]).filter(Boolean)
  if (decision.action === 'HOLD') {
    const temperatureReason = Math.abs(diagnostics.skinTempSlopePerMinute ?? 0) <= 0.005
      ? '这里最近的温度基本稳定'
      : mapped.find((reason) => reason.includes('变凉') || reason.includes('变热'))
    const humidityReason = Math.abs(diagnostics.humiditySlopePerMinute ?? 0) <= 0.1
      ? '局部湿度没有明显变化'
      : mapped.find((reason) => reason.includes('湿度'))
    const personalReason = (diagnostics.similarEpisodeCount ?? 0) > 0
      ? `有${diagnostics.similarEpisodeCount}次相似情况可以参考`
      : '还没有足够的相似情况可以参考'
    return unique([temperatureReason, humidityReason, '这里的接触稳定', personalReason]).slice(0, 4)
  }

  return unique([...mapped, '这里的接触稳定']).slice(0, 4)
}

function ensureSentence(text) {
  return /[。！？]$/.test(text) ? text : `${text}。`
}

function primaryLeadFor(decision, userReasons) {
  if (decision.sensorQuality === 'DEGRADED') return ['刚刚的信号还不够稳定，先继续观察。']
  if (decision.sensorQuality === 'INVALID') return ['暂时读不到稳定数据，先不调整。']
  if (decision.action === 'HOLD') {
    const stable = Math.abs(decision.diagnostics?.skinTempSlopePerMinute ?? 0) <= 0.005
    return [stable ? '这里目前比较稳定。' : ensureSentence(userReasons[0]), '先不调整，再观察一会儿。']
  }
  return userReasons.slice(0, 2).map(ensureSentence)
}

function evidenceTitleFor(action) {
  if (action === 'WARM') return '为什么暖一点'
  if (action === 'COOL') return '为什么凉一点'
  return '为什么先不调'
}

function technicalEvidenceFor(decision) {
  return [
    ['数据状态', technicalDataStatus(decision.sensorQuality)],
    ['判断置信度', `${Math.round(decision.confidence * 100)}%`],
    ['温度变化率', formatSlope(decision.diagnostics?.skinTempSlopePerMinute, '°C/分钟')],
    ['局部湿度', formatCompact(decision.diagnostics?.localHumidity, '%', 1)],
    ['局部与身体温差', formatValue(decision.diagnostics?.zoneToBodyDelta, '°C')],
    ['相似状态数量', `${decision.diagnostics?.similarEpisodeCount ?? 0}个`],
  ]
}

export function engineSheet(decision, fallback) {
  if (!decision) {
    return {
      ...fallback,
      evidenceTitle: fallback.dir === '暖一点' ? '为什么暖一点' : fallback.dir === '凉一点' ? '为什么凉一点' : '为什么先不调',
      userReasons: fallback.lead,
      dataStatus: '正在读取当前数据',
      confidenceLabel: '等待当前判断',
      reevaluateLabel: '读取完成后更新',
      technicalEvidence: fallback.evidence || [],
    }
  }
  const userReasons = userReasonsFor(decision)
  const unsafe = decision.sensorQuality !== 'GOOD'
  return {
    ...fallback,
    dir: unsafe ? '先不调整，继续观察' : actionCopy(decision),
    lead: primaryLeadFor(decision, userReasons),
    action: {
      text: decision.action === 'WARM' ? '正在暖一点' : decision.action === 'COOL' ? '正在凉一点' : '保持刚刚好',
      time: decision.durationMinutes ? `约${decision.durationMinutes}分钟` : '暂不调节',
    },
    hint: `${decision.reevaluateAfterMinutes}分钟后再看看。`,
    evidenceTitle: evidenceTitleFor(decision.action),
    userReasons,
    dataStatus: dataStatusCopy(decision.sensorQuality),
    confidenceLabel: confidenceCopy(decision.confidence),
    reevaluateLabel: `${decision.reevaluateAfterMinutes}分钟后再看看`,
    technicalEvidence: technicalEvidenceFor(decision),
  }
}

function formatValue(value, unit) {
  return Number.isFinite(value) ? `${value.toFixed(2)}${unit}` : '暂无'
}

function formatSlope(value, unit) {
  if (!Number.isFinite(value)) return '暂无'
  return `${value > 0 ? '+' : ''}${value.toFixed(3)}${unit}`
}

function formatCompact(value, unit, digits) {
  if (!Number.isFinite(value)) return '暂无'
  return `${Number(value.toFixed(digits))}${unit}`
}
