import React from 'react'
import Icon from './Icon.jsx'

export function StatusBar() {
  return (
    <div className="statusbar">
      <span>0:48</span>
      <span className="sb-right"><span style={{ fontSize: 13 }}>全</span><span className="sb-dot" /></span>
    </div>
  )
}

const TABS = [
  { key: 'titie', label: '体贴', icon: 'titie' },
  { key: 'sleep', label: '好好睡', icon: 'sleep' },
  { key: 'me', label: '我的', icon: 'me' },
]

export function BottomNav({ active, onChange }) {
  return (
    <div className="tabbar">
      {TABS.map((t) => (
        <button
          type="button"
          key={t.key}
          className={'tab-item' + (active === t.key ? ' active' : '')}
          onClick={() => onChange(t.key)}
          aria-label={t.label}
          aria-current={active === t.key ? 'page' : undefined}
        >
          <Icon name={t.icon} />
          <span className="tb-l">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
