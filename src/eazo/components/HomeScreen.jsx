import React from 'react'
import Icon from './Icon.jsx'
import figure from '../assets/sleep-figure.png'
import { regions, ambient } from '../data/content.js'

// 位置按真机预览标定（俯拍全身，人物偏中右）：肩背=右肩上背、膝腿=被子下膝盖弯曲处
export const BODY_MARKER_POSITIONS = {
  // 位置按当前睡眠照片标定：肩背点向右落在可见肩胛外侧，标签向左展开。
  shoulder: { top: '25.5%', left: '76%' },
  knee: { top: '63%', left: '46%' },
}

export default function HomeScreen({ degrade, decisions, apiFallback, onOpenRegion, onTurn, theme, onToggleTheme }) {
  const shoulderTone = decisions.shoulder?.action === 'WARM' ? 'warm' : decisions.shoulder?.action === 'HOLD' ? 'steady' : 'cool'
  const kneeTone = decisions.knee?.action === 'COOL' ? 'cool' : decisions.knee?.action === 'HOLD' ? 'steady' : 'warm'
  const preferenceFor = (decision, tone = 'steady') => decision?.action === 'WARM'
    ? '想暖一点'
    : decision?.action === 'COOL'
      ? '想凉一点'
      : decision?.action === 'HOLD'
        ? '刚刚好'
        : tone === 'warm'
          ? '想暖一点'
          : tone === 'cool'
            ? '想凉一点'
            : '刚刚好'
  return (
    <div className="immersive">
      <div className="immersive-photo" style={{ backgroundImage: `url(${figure})` }} />
      <div className="immersive-tint" />
      <div className="immersive-veil" />

      {/* 顶部环境 HUD */}
      <div className="hud">
        <span className="hud-time">{ambient.time}</span>
        <span className="hud-chip"><Icon name="temp" /><b>{ambient.temp}</b></span>
        <span className="hud-chip"><Icon name="humidity" /><b>{ambient.humidity}</b></span>
        <button type="button" className="theme-toggle" onClick={onToggleTheme}
          title={theme === 'night' ? '切换到白天' : '切换到夜晚'}
          aria-label={theme === 'night' ? '当前夜晚，切换到白天' : '当前白天，切换到夜晚'}
          aria-pressed={theme === 'day'}>
          <span className="theme-mode-icon" aria-hidden="true"><Icon name={theme === 'night' ? 'moondot' : 'sun'} /></span>
          <span className="theme-mode-label">{theme === 'night' ? '夜晚' : '白天'}</span>
        </button>
      </div>

      {/* 左侧 6 部位菜单 */}
      <div className="rail">
        {regions.map((r) => (
          <button
            type="button"
            key={r.key}
            className={'rail-item ' + (decisions[r.key]?.action === 'WARM' ? 'warm' : decisions[r.key]?.action === 'COOL' ? 'cool' : r.tone)}
            onClick={() => onOpenRegion(r.key)}
            aria-label={r.name}
          >
            <span className="rail-ic"><Icon name={r.icon} /></span>
            <span className="rail-name">{r.name}</span>
            <span className="rail-status">{preferenceFor(decisions[r.key], r.tone)}</span>
          </button>
        ))}
      </div>

      {!degrade && (
        <>
          {/* 发光圆点标注 —— 颜色表示"产品动作"：偏热→需要凉一点(蓝) / 偏凉→需要暖一点(橙) */}
          <button type="button" className={'glowdot shoulder-marker ' + shoulderTone} style={{ top: BODY_MARKER_POSITIONS.shoulder.top, left: BODY_MARKER_POSITIONS.shoulder.left }}
            onClick={() => onOpenRegion('shoulder')} aria-label="肩背">
            <span className="gd-orb" />
            <span className="gd-label">肩背<span className="gl-s">{preferenceFor(decisions.shoulder, 'cool')}</span></span>
          </button>
          <button type="button" className={'glowdot ' + kneeTone} style={{ top: BODY_MARKER_POSITIONS.knee.top, left: BODY_MARKER_POSITIONS.knee.left }}
            onClick={() => onOpenRegion('knee')} aria-label="膝腿">
            <span className="gd-orb" />
            <span className="gd-label">膝腿<span className="gl-s">{preferenceFor(decisions.knee, 'warm')}</span></span>
          </button>
        </>
      )}

      {/* 翻身 / 数据暂时不稳定 —— 安静态 */}
      {degrade && (
        <div className="imm-note" role="status" aria-live="polite">
          <div className="in-strong">先不调整，继续观察。</div>
          <div className="in-sub">你刚翻了个身，局部接触还在恢复。<br />拿不准的时候，不急着调。</div>
        </div>
      )}

      {/* 底部监测中（轻触演示：翻身后先不调整） */}
      <div className="monitor">
        <button type="button" className="monitor-inner" onClick={onTurn} title="演示：翻身后先不调整">
          <span className="mn-pulse" />
          {degrade ? '接触恢复中 · 暂时不调' : '演示数据 · 每5分钟更新一次'}
        </button>
        {apiFallback && <div className="api-fallback">当前为体验模式</div>}
      </div>
    </div>
  )
}
