import React, { useState } from 'react'
import Icon from './Icon.jsx'
import { sessions, weekStats, monthStats } from '../data/content.js'

export default function SleepScreen({ onOpenFeedback }) {
  const [seg, setSeg] = useState('日')
  const [sessionIndex, setSessionIndex] = useState(sessions.length - 1)
  const session = sessions[sessionIndex]
  const canPrevious = sessionIndex > 0
  const canNext = sessionIndex < sessions.length - 1
  const stats = seg === '月' ? monthStats : weekStats

  return (
    <>
      <div className="page-head">
        <div className="ph-title">好好睡</div>
      </div>

      <div className="date-switch">
        <button className="ds-arrow" disabled={!canPrevious} aria-label="上一晚" onClick={() => canPrevious && setSessionIndex((i) => i - 1)}><Icon name="left" /></button>
        <div className="ds-date">{session.date}</div>
        <button className="ds-arrow" disabled={!canNext} aria-label="下一晚" onClick={() => canNext && setSessionIndex((i) => i + 1)}><Icon name="right" /></button>
      </div>

      <div className="seg" role="tablist" aria-label="睡眠记录范围">
        {['日', '周', '月'].map((s) => (
          <button type="button" role="tab" aria-selected={seg === s} key={s}
            className={'seg-item' + (seg === s ? ' active' : '')} onClick={() => setSeg(s)}>{s}</button>
        ))}
      </div>

      {seg === '日' ? (
        <>
          <div className="session-card">
            <div className="sc-range">{session.range}</div>
            <div className="sc-dur">{session.duration}</div>
            <div className="sc-note">{session.summary}</div>
          </div>
          <div className="section-t">夜间记录</div>
          <div className="timeline">
            {session.timeline.map((it, i) => (
              <div key={i} className={'tl-item ' + it.tone}>
                <div className="tl-time">{it.time}</div>
                <div className="tl-text">{it.text}</div>
              </div>
            ))}
          </div>
          <div className="section-t">冷暖调节</div>
          <div className="stat-card">
            <div className="stat-row"><span className="stat-l">夜间调整</span><span className="stat-v">{session.caredZones}</span></div>
            <div className="stat-row"><span className="stat-l">你的反馈</span><span className="stat-v">{session.feedback}</span></div>
          </div>
        </>
      ) : (
        <>
          <div className="section-t">{seg === '周' ? '最近一周' : '最近30天'}</div>
          <div className="stat-card">
            <div className="stat-lead">{stats.lead}</div>
            {stats.rows.map(([l, v]) => (
              <div key={l} className="stat-row"><span className="stat-l">{l}</span><span className="stat-v">{v}</span></div>
            ))}
          </div>
          <div className="stat-foot">{stats.foot}</div>
        </>
      )}

      {/* 轻量入口：睡后反馈（不在底部导航里） */}
      <button type="button" className="fb-entry" onClick={onOpenFeedback}>
        <span className="fe-t">睡后反馈 · 这晚冷暖合适吗？</span>
        <span className="fe-chev"><Icon name="chev" /></span>
      </button>
    </>
  )
}
