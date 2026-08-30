import React, { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import { sheets } from '../data/content.js'
import { actionTone, engineSheet } from '../data/engine-view.js'

export default function RegionSheet({ regionKey, decision, onClose }) {
  const open = !!regionKey
  const data = regionKey ? engineSheet(decision, sheets[regionKey]) : null
  const tone = decision ? actionTone(decision) : regionKey === 'knee' ? 'warm' : regionKey === 'shoulder' ? 'cool' : 'steady'
  const sheetRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    previousFocus.current = document.activeElement
    sheetRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus.current?.focus?.()
    }
  }, [onClose, open])

  return (
    <>
      <div className={'sheet-scrim' + (open ? ' open' : '')} onClick={onClose} aria-hidden="true" />
      <div ref={sheetRef} className={'sheet' + (open ? ' open' : '')} role="dialog" aria-modal="true"
        aria-hidden={!open} aria-labelledby={open ? 'region-sheet-title' : undefined} tabIndex={-1}>
        <button type="button" className="sheet-grab" onClick={onClose} aria-label="关闭区域详情" />
        {data && (
          <div className="sheet-body">
            <div className={'sheet-head to-' + tone}>
              <span className="sh-ic"><Icon name={tone === 'steady' ? 'steady' : tone} /></span>
              <div>
                <div className="sh-title" id="region-sheet-title">{data.region}</div>
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

            {/* 用户只看到自然语言原因；工程参数保留在内部接口与测试中。 */}
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
              </div>
            </details>
          </div>
        )}
      </div>
    </>
  )
}
