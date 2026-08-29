import React from 'react'
import Icon from './Icon.jsx'
import figure from '../assets/sleep-figure.png'
import { regions, ambient } from '../data/content.js'

// 位置按真机预览标定（俯拍全身，人物偏中右）：肩背=右肩上背、膝腿=被子下膝盖弯曲处
export const BODY_MARKER_POSITIONS = {
  // 落在可见右肩与上背交界，避开原先误标到前臂/胸前的位置。
  shoulder: { top: '29%', left: '77%' },
  knee: { top: '63%', left: '46%' },
}

export default function HomeScreen({ degrade, decisions, apiFallback, onOpenRegion, onTurn, theme, onToggleTheme }) {
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
        <span className="theme-toggle" onClick={onToggleTheme} role="button"
          title="切换白天 / 夜晚" aria-label="切换白天夜晚">
          <Icon name={theme === 'night' ? 'sun' : 'moondot'} />
          {theme === 'night' ? '白天' : '夜晚'}
        </span>
      </div>

      {/* 左侧 6 部位菜单 */}
      <div className="rail">
        {regions.map((r) => (
          <div
            key={r.key}
            className={'rail-item ' + (decisions[r.key]?.action === 'WARM' ? 'warm' : decisions[r.key]?.action === 'COOL' ? 'cool' : r.tone)}
            onClick={() => (r.tone === 'steady' ? null : onOpenRegion(r.key))}
            role="button"
            aria-label={r.name}
          >
            <span className="rail-ic"><Icon name={r.icon} /></span>
            <span className="rail-name">{r.name}</span>
            <span className="rail-status">{decisions[r.key]?.action === 'WARM' ? '偏凉' : decisions[r.key]?.action === 'COOL' ? '偏热' : r.status}</span>
          </div>
        ))}
      </div>

      {!degrade && (
        <>
          {/* 发光圆点标注 —— 颜色表示"产品动作"：偏热→需要凉一点(蓝) / 偏凉→需要暖一点(橙) */}
          <div className="glowdot cool" style={{ top: BODY_MARKER_POSITIONS.shoulder.top, left: BODY_MARKER_POSITIONS.shoulder.left }}
            onClick={() => onOpenRegion('shoulder')} role="button" aria-label="肩背">
            <span className="gd-orb" />
            <span className="gd-label">肩背<span className="gl-s">偏热</span></span>
          </div>
          <div className="glowdot warm" style={{ top: BODY_MARKER_POSITIONS.knee.top, left: BODY_MARKER_POSITIONS.knee.left }}
            onClick={() => onOpenRegion('knee')} role="button" aria-label="膝腿">
            <span className="gd-orb" />
            <span className="gd-label">膝腿<span className="gl-s">偏凉</span></span>
          </div>
        </>
      )}

      {/* 翻身 / 数据暂时不稳定 —— 安静态 */}
      {degrade && (
        <div className="imm-note">
          <div className="in-strong">先不调整，继续观察。</div>
          <div className="in-sub">你刚翻了个身，局部接触还在恢复。<br />拿不准的时候，不急着调。</div>
        </div>
      )}

      {/* 底部监测中（轻触演示：翻身后先不调整） */}
      <div className="monitor">
        <div className="monitor-inner" onClick={onTurn} role="button" title="演示：翻身后先不调整">
          <span className="mn-pulse" />
          {degrade ? '正在重新感知 · 保持安静' : '正在监测中 · 每5分钟更新一次'}
        </div>
        {apiFallback && <div className="api-fallback">Prototype Simulation · API fallback</div>}
      </div>
    </div>
  )
}
