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

export function engineSheet(decision, fallback) {
  if (!decision) return fallback
  const unsafe = decision.sensorQuality !== 'GOOD'
  if (unsafe) {
    return {
      ...fallback,
      dir: '先不调整，继续观察',
      lead: decision.reasons.map((reason) => reason.message),
      action: { text: '保持刚刚好', time: '暂不调节' },
      hint: `${decision.reevaluateAfterMinutes}分钟后再看看。`,
    evidence: [
        ['传感质量', decision.sensorQuality],
        ['置信度', `${Math.round(decision.confidence * 100)}%`],
        ['温度变化率', formatSlope(decision.diagnostics?.skinTempSlopePerMinute, '°C/分钟')],
        ['局部与身体温差', formatValue(decision.diagnostics?.zoneToBodyDelta, '°C')],
        ['相似状态', `${decision.diagnostics?.similarEpisodeCount ?? 0}个`],
        ['Engine action', decision.action],
        ['原始判断理由', decision.reasons.map((reason) => reason.code).join(' · ')],
      ],
    }
  }
  return {
    ...fallback,
    dir: actionCopy(decision),
    lead: decision.reasons.slice(0, 3).map((reason) => reason.message),
    action: {
      text: decision.action === 'WARM' ? '正在暖一点' : decision.action === 'COOL' ? '正在凉一点' : '保持刚刚好',
      time: decision.durationMinutes ? `约${decision.durationMinutes}分钟` : '暂不调节',
    },
    hint: `${decision.reevaluateAfterMinutes}分钟后再看看。`,
      evidence: [
      ['传感质量', decision.sensorQuality],
      ['置信度', `${Math.round(decision.confidence * 100)}%`],
      ['温度变化率', formatSlope(decision.diagnostics?.skinTempSlopePerMinute, '°C/分钟')],
      ['局部湿度', formatValue(decision.diagnostics?.localHumidity, '%')],
      ['局部与身体温差', formatValue(decision.diagnostics?.zoneToBodyDelta, '°C')],
      ['相似状态', `${decision.diagnostics?.similarEpisodeCount ?? 0}个`],
      ['ControlCommand', commandSummary(decision.controlCommand)],
      ['Engine action', decision.action],
      ['原始判断理由', decision.reasons.map((reason) => reason.code).join(' · ')],
    ],
  }
}

function formatValue(value, unit) {
  return Number.isFinite(value) ? `${value.toFixed(2)}${unit}` : '暂无'
}

function formatSlope(value, unit) {
  if (!Number.isFinite(value)) return '暂无'
  return `${value > 0 ? '+' : ''}${value.toFixed(3)}${unit}`
}

function commandSummary(command) {
  if (!command) return '暂无'
  return `${command.direction} · level ${command.level} · ${command.durationMinutes}分钟`
}
