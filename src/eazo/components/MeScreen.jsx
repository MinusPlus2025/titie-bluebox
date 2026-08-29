import React, { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { mine, mePanels } from '../data/content.js'

const panelKeyByTitle = {
  常用睡眠时段: 'sleep_time', 午睡习惯: 'nap', 周期信息: 'cycle', 潮热情况: 'hot_flash',
  睡前运动: 'exercise', 同睡情况: 'cosleep', 我的蓝盒子: 'device', 数据与隐私: 'privacy', 关于体贴: 'about',
}

function Row({ icon, t, v, optional, onClick }) {
  return (
    <button className="list-row" onClick={onClick}>
      <span className="lr-ic"><Icon name={icon} /></span>
      <span className="lr-t">{t}{optional && <span className="optional-tag">可选</span>}</span>
      {v && <span className="lr-v">{v}</span>}
      <span className="lr-chev"><Icon name="chev" /></span>
    </button>
  )
}

export default function MeScreen() {
  const [panelKey, setPanelKey] = useState(null)
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('titie.preferences') || '{}') }
    catch { return {} }
  })
  const panel = panelKey ? mePanels[panelKey] : null

  useEffect(() => { localStorage.setItem('titie.preferences', JSON.stringify(settings)) }, [settings])

  function rowProps(row) {
    const key = panelKeyByTitle[row.t]
    return { ...row, v: settings[key] || row.v, onClick: () => setPanelKey(key) }
  }

  return (
    <>
      <div className="page-head">
        <div className="ph-title">我的</div>
      </div>

      <div className="group">
        <div className="group-t">我的睡眠</div>
        <div className="list-card">
          {mine.sleep.map((r) => <Row key={r.t} {...rowProps(r)} />)}
        </div>
      </div>

      <div className="group">
        <div className="group-t">我的身体状态</div>
        <div className="group-note">可选，用于帮助理解不同状态。这些信息不会成为固定的控制规则。</div>
        <div className="list-card">
          {mine.bodyOptional.map((r) => <Row key={r.t} {...rowProps(r)} optional />)}
        </div>
      </div>

      <div className="group">
        <div className="list-card">
          {mine.system.map((r) => <Row key={r.t} {...rowProps(r)} />)}
        </div>
      </div>

      <div style={{ height: 20 }} />
      <div className={'sheet-scrim' + (panel ? ' open' : '')} onClick={() => setPanelKey(null)} />
      <div className={'sheet preference-sheet' + (panel ? ' open' : '')}>
        <div className="sheet-grab" />
        {panel && <div className="sheet-body">
          <div className="preference-title">{panel.title}</div>
          {panel.note && <div className="preference-note">{panel.note}</div>}
          {panel.options?.map((option) => (
            <button key={option} className={'preference-option' + (settings[panelKey] === option ? ' active' : '')}
              onClick={() => setSettings((current) => ({ ...current, [panelKey]: option }))}>
              <span>{option}</span>{settings[panelKey] === option && <Icon name="check" />}
            </button>
          ))}
          {panel.lines?.map((line, index) => <div className={index === 0 ? 'preference-lead' : 'preference-line'} key={line}>{line}</div>)}
          <button className="preference-done" onClick={() => setPanelKey(null)}>完成</button>
        </div>}
      </div>
    </>
  )
}
