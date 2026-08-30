import React, { useState } from 'react'
import Icon from './Icon.jsx'
import { feedback as fb, feedbackRegions } from '../data/content.js'
import { feedbackPayload, titieApi } from '../../services/titieApi.js'

export default function FeedbackScreen({ onClose }) {
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [region, setRegion] = useState('knee')

  async function submit() {
    if (!sel || sending) return
    setSending(true)
    setError(false)
    try {
      await titieApi.submitFeedback(feedbackPayload(sel, region))
      setDone(true)
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="fb-confirm" role="status" aria-live="polite">
        <div className="fc-badge"><Icon name="check" /></div>
        <div className="fcc-t">{fb.confirmTitle}</div>
        <div className="fcc-s">{fb.confirmSub}</div>
        <button className="fcc-btn" onClick={onClose}>好的</button>
      </div>
    )
  }

  return (
    <div className="fb-screen" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <button type="button" className="fb-close" onClick={onClose} aria-label="返回睡眠记录">返回</button>
      <div className="fb-head">
        <div className="fb-t" id="feedback-title">{fb.title}</div>
        <div className="fb-s">{fb.sub}</div>
      </div>

      <div className="fb-region">
        <span>选择位置</span>
      </div>
      <div className="fb-region-grid" role="group" aria-label="反馈身体区域">
        {feedbackRegions.map((item) => (
          <button type="button" key={item.key} aria-pressed={region === item.key}
            className={'fbr-chip' + (region === item.key ? ' active' : '')} onClick={() => setRegion(item.key)}>{item.name}</button>
        ))}
      </div>

      <div className="fb-q">{fb.question}</div>
      <div className="fb-choices">
        {fb.choices.map((c) => (
          <button
            type="button"
            key={c.key}
            className={'fb-choice ' + c.tone + (sel === c.key ? ' sel' : '')}
            onClick={() => setSel(c.key)}
            aria-pressed={sel === c.key}
          >
            <span className="fc-ic"><Icon name={c.tone === 'steady' ? 'steady' : c.tone} /></span>
            <span className="fc-t">{c.t}</span>
          </button>
        ))}
      </div>

      {error && <div className="fb-error" role="alert">暂时没能保存，请再试一次。</div>}

      <button className="fb-submit" disabled={!sel || sending} onClick={submit}>
        {sending ? '正在保存…' : '确认'}
      </button>
    </div>
  )
}
