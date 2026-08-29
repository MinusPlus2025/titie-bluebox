import { PHASE_2_SCENARIO_DATASET } from '../validation/scenario-dataset.js'

const observation = PHASE_2_SCENARIO_DATASET.observations.find((item) => item.id === 'opposite-zones')
const feedbackObservation = PHASE_2_SCENARIO_DATASET.observations.find((item) => item.id === 'personal-borderline')

export const ZONE_KEY_MAP = {
  neck: 'head_neck',
  shoulder: 'shoulder_back',
  waist: 'waist_abdomen',
  thigh: 'thigh',
  knee: 'knee_leg',
  foot: 'foot',
}
export const ZONE_KEYS = Object.keys(ZONE_KEY_MAP)
let learnedFeedback = []

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) throw new Error(`${path} returned ${response.status}`)
  return response.json()
}

export function evaluationPayload(zoneKey, quality = 'GOOD') {
  const zone = ZONE_KEY_MAP[zoneKey] || zoneKey
  const window = structuredClone(observation.windows[zone])
  if (quality !== 'GOOD') {
    window.sensorQuality = {
      status: quality,
      missingSignals: quality === 'INVALID' ? ['localSkinTemp'] : ['movement'],
      lastValidTimestamp: observation.context.currentTime,
    }
  }
  return {
    profile: observation.profile,
    window,
    context: observation.context,
    history: {
      feedback: [...observation.history.feedback, ...learnedFeedback],
      interventions: observation.history.interventions,
    },
  }
}

export const titieApi = {
  health: () => request('/api/health'),
  evaluate: (payload) => request('/api/evaluate', { method: 'POST', body: JSON.stringify(payload) }),
  submitFeedback: async (payload) => {
    const result = await request('/api/feedback', { method: 'POST', body: JSON.stringify(payload) })
    if (result?.accepted && result.feedback) learnedFeedback = [...learnedFeedback, result.feedback]
    return result
  },
  getValidation: () => request('/api/validate'),
}

export async function evaluateZone(zoneKey, quality = 'GOOD') {
  return titieApi.evaluate(evaluationPayload(zoneKey, quality))
}

export function feedbackPayload(choice, zoneKey = 'knee') {
  const label = { warm: '暖一点', steady: '刚刚好', cool: '凉一点' }[choice]
  const zone = ZONE_KEY_MAP[zoneKey] || zoneKey
  return {
    profile: feedbackObservation.profile,
    window: feedbackObservation.windows[zone],
    context: feedbackObservation.context,
    history: feedbackObservation.history,
    label,
  }
}
