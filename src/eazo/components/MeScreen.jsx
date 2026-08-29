import React from 'react'
import Icon from './Icon.jsx'
import { mine } from '../data/content.js'

function Row({ icon, t, v, optional }) {
  return (
    <div className="list-row" role="button">
      <span className="lr-ic"><Icon name={icon} /></span>
      <span className="lr-t">{t}{optional && <span className="optional-tag">可选</span>}</span>
      {v && <span className="lr-v">{v}</span>}
      <span className="lr-chev"><Icon name="chev" /></span>
    </div>
  )
}

export default function MeScreen() {
  return (
    <>
      <div className="page-head">
        <div className="ph-title">我的</div>
      </div>

      <div className="group">
        <div className="group-t">我的睡眠</div>
        <div className="list-card">
          {mine.sleep.map((r) => <Row key={r.t} {...r} />)}
        </div>
      </div>

      <div className="group">
        <div className="group-t">我的身体状态</div>
        <div className="group-note">可选，用于帮助理解不同状态。这些信息不会成为固定的控制规则。</div>
        <div className="list-card">
          {mine.bodyOptional.map((r) => <Row key={r.t} {...r} optional />)}
        </div>
      </div>

      <div className="group">
        <div className="list-card">
          {mine.system.map((r) => <Row key={r.t} {...r} />)}
        </div>
      </div>

      <div style={{ height: 20 }} />
    </>
  )
}
