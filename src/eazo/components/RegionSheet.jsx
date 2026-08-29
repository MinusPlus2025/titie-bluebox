import React from 'react'
import Icon from './Icon.jsx'
import { sheets } from '../data/content.js'
import { actionTone, engineSheet } from '../data/engine-view.js'

export default function RegionSheet({ regionKey, decision, apiFallback, onClose }) {
  const open = !!regionKey
  const data = regionKey ? engineSheet(decision, sheets[regionKey]) : null
  const tone = decision ? actionTone(decision) : regionKey === 'knee' ? 'warm' : regionKey === 'shoulder' ? 'cool' : 'steady'

  return (
    <>
      <div className={'sheet-scrim' + (open ? ' open' : '')} onClick={onClose} />
      <div className={'sheet' + (open ? ' open' : '')}>
        <div className="sheet-grab" />
        {data && (
          <div className="sheet-body">
            <div className={'sheet-head to-' + tone}>
              <span className="sh-ic"><Icon name={tone === 'steady' ? 'steady' : tone} /></span>
              <div>
                <div className="sh-title">{data.region}</div>
                <div className="sh-sub">{data.dir}</div>
              </div>
            </div>

            <div className="sheet-lead">
              {data.lead.map((l, i) => (
                <div key={i} className={i === data.lead.length - 1 ? 'muted' : ''} style={{ marginTop: i ? 6 : 0 }}>{l}</div>
              ))}
            </div>

            <div className={'sheet-action act-' + tone}>
              <span className="sa-ic"><Icon name={tone === 'steady' ? 'steady' : tone} /></span>
              <div>
                <div className="sa-t">{data.action.text}</div>
                <div className="sa-time">{data.action.time}</div>
              </div>
            </div>
            <div className="sheet-hint">{data.hint}</div>

            {/* 弱入口：查看判断依据 */}
            <details className="disclose" key={regionKey}>
              <summary className="disclose-trigger">
                <span>查看判断依据</span>
                <Icon name="chev" />
              </summary>
              <div className="disclose-panel">
                <div className="evidence-list">
                  {data.evidence.map(([k, v]) => (
                    <div key={k} className="evidence-row">
                      <span className="er-label">{k}</span>
                      <span className="er-val">{v}</span>
                    </div>
                  ))}
                </div>
                <span className="sim-badge"><span className="sb-dot2" />Prototype Simulation{apiFallback ? ' · API fallback' : ''}</span>
              </div>
            </details>
          </div>
        )}
      </div>
    </>
  )
}
