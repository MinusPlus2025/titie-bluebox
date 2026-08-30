import React, { useState } from 'react'
import Icon from './Icon.jsx'
import { feedback as fb, feedbackRegions } from '../data/content.js'
import { feedbackPayload, titieApi } from '../../services/titieApi.js'

export default function FeedbackScreen({ onClose }) {
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [apiFallback, setApiFallback] = useState(false)
  const [region, setRegion] = useState('knee')

  async function submit() {
    if (!sel || sending) return
    setSending(true)
    try { await titieApi.submitFeedback(feedbackPayload(sel, region)) }
    catch { setApiFallback(true) }
    finally { setSending(false); setDone(true) }
  }

  if (done) {
    return (
      <div className="fb-confirm">
        <div className="fc-badge"><Icon name="check" /></div>
        <div className="fcc-t">{fb.confirmTitle}</div>
        <div className="fcc-s">{fb.confirmSub}</div>
        {apiFallback && <div className="sim-badge">原型模拟 · 暂时使用本地演示数据</div>}
        <button className="fcc-btn" onClick={onClose}>好的</button>
      </div>
    )
  }

  return (
    <div className="fb-screen">
      <div className="fb-head">
        <div className="fb-t">{fb.title}</div>
        <div className="fb-s">{fb.sub}</div>
      </div>

      <div className="fb-region">
        <span>选择位置</span>
      </div>
      <div className="fb-region-grid" role="group" aria-label="反馈身体区域">
        {feedbackRegions.map((item) => (
          <button key={item.key} className={'fbr-chip' + (region === item.key ? ' active' : '')} onClick={() => setRegion(item.key)}>{item.name}</button>
        ))}
      </div>

      <div className="fb-q">{fb.question}</div>
      <div className="fb-choices">
        {fb.choices.map((c) => (
          <div
            key={c.key}
            className={'fb-choice ' + c.tone + (sel === c.key ? ' sel' : '')}
            onClick={() => setSel(c.key)}
            role="button"
          >
            <span className="fc-ic"><Icon name={c.tone === 'steady' ? 'steady' : c.tone} /></span>
            <span className="fc-t">{c.t}</span>
          </div>
        ))}
      </div>

      <button className="fb-submit" disabled={!sel || sending} onClick={submit}>
        {sending ? '正在保存…' : '确认'}
      </button>
    </div>
  )
}
