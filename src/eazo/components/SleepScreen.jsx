import React, { useState } from 'react'
import Icon from './Icon.jsx'
import { session, weekStats } from '../data/content.js'

export default function SleepScreen({ onOpenFeedback }) {
  const [seg, setSeg] = useState('日')

  return (
    <>
      <div className="page-head">
        <div className="ph-title">好好睡</div>
      </div>

      <div className="date-switch">
        <div className="ds-arrow" role="button"><Icon name="left" /></div>
        <div className="ds-date">{session.date}</div>
        <div className="ds-arrow" role="button"><Icon name="right" /></div>
      </div>

      <div className="seg">
        {['日', '周', '月'].map((s) => (
          <div key={s} className={'seg-item' + (seg === s ? ' active' : '')} onClick={() => setSeg(s)} role="button">{s}</div>
        ))}
      </div>

      {/* 这一觉 */}
      <div className="session-card">
        <div className="sc-range">这一觉 · {session.range}</div>
        <div className="sc-dur">{session.duration}</div>
        <div className="sc-note">{session.summary}</div>
      </div>

      <div className="section-t">这一觉发生了什么</div>
      <div className="timeline">
        {session.timeline.map((it, i) => (
          <div key={i} className={'tl-item ' + it.tone}>
            <div className="tl-time">{it.time}</div>
            <div className="tl-text">{it.text}</div>
          </div>
        ))}
      </div>

      {/* 最近7觉 */}
      <div className="section-t">最近7觉</div>
      <div className="stat-card">
        <div className="stat-lead">{weekStats.lead}</div>
        {weekStats.rows.map(([l, v]) => (
          <div key={l} className="stat-row">
            <span className="stat-l">{l}</span>
            <span className="stat-v">{v}</span>
          </div>
        ))}
      </div>
      <div className="stat-foot">{weekStats.foot}</div>

      {/* 轻量入口：睡后反馈（不在底部导航里） */}
      <div className="fb-entry" onClick={onOpenFeedback} role="button">
        <span className="fe-t">这一觉结束了 · 说说冷暖合不合适</span>
        <span className="fe-chev"><Icon name="chev" /></span>
      </div>
    </>
  )
}
