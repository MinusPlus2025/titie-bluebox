import React from 'react'
import Icon from './Icon.jsx'
import { sheets } from '../data/content.js'
import { actionTone, engineSheet } from '../data/engine-view.js'

export default function RegionSheet({ regionKey, decision, onClose }) {
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

            {/* 用户解释优先，工程参数置于二级折叠层。 */}
            <details className="disclose" key={regionKey}>
              <summary className="disclose-trigger">
                <span>{data.evidenceTitle}</span>
                <Icon name="chev" />
              </summary>
              <div className="disclose-panel">
                <div className="user-reason-list">
                  {data.userReasons.map((reason) => (
                    <div key={reason} className="user-reason">
                      <span className="user-reason-mark" aria-hidden="true" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                <div className="evidence-status">
                  <div><strong>{data.dataStatus}</strong><span>{data.confidenceLabel}</span></div>
                  <span>{data.reevaluateLabel}</span>
                </div>
                <details className="technical-disclose">
                  <summary className="technical-trigger">
                    <span>技术详情</span>
                    <Icon name="chev" />
                  </summary>
                  <div className="evidence-list">
                    {data.technicalEvidence.map(([k, v]) => (
                      <div key={k} className="evidence-row">
                        <span className="er-label">{k}</span>
                        <span className="er-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </details>
                <span className="sim-badge"><span className="sb-dot2" />原型模拟</span>
              </div>
            </details>
          </div>
        )}
      </div>
    </>
  )
}
