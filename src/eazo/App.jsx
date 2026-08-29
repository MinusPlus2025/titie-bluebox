import React, { useState, useEffect, useRef } from 'react'
import { StatusBar, BottomNav } from './components/Chrome.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import SleepScreen from './components/SleepScreen.jsx'
import MeScreen from './components/MeScreen.jsx'
import RegionSheet from './components/RegionSheet.jsx'
import FeedbackScreen from './components/FeedbackScreen.jsx'
import ValidationScreen from './components/ValidationScreen.jsx'
import { evaluateZone, ZONE_KEYS } from '../services/titieApi.js'

export default function App() {
  const [tab, setTab] = useState('titie')
  const [region, setRegion] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [degrade, setDegrade] = useState(false)
  const [decisions, setDecisions] = useState({})
  const [apiFallback, setApiFallback] = useState(false)
  const [validationRoute, setValidationRoute] = useState(window.location.pathname === '/validation')
  const [theme, setTheme] = useState('night')     // 'night' 冷蓝 / 'day' 暖白
  const turnTimer = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    Promise.all(ZONE_KEYS.map(async (key) => {
      try { return [key, await evaluateZone(key)] }
      catch { setApiFallback(true); return null }
    })).then((pairs) => setDecisions(Object.fromEntries(pairs.filter(Boolean))))
    const onPop = () => setValidationRoute(window.location.pathname === '/validation')
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      if (turnTimer.current) clearTimeout(turnTimer.current)
    }
  }, [])

  async function openRegion(key) {
    setRegion(key)
    try {
      const decision = await evaluateZone(key)
      setDecisions((current) => ({ ...current, [key]: decision }))
    } catch {
      setApiFallback(true)
    }
  }

  // 翻身演示：短暂进入"先不调整"，再自动回到正常
  async function simulateTurn() {
    setRegion(null)
    setDegrade(true)
    try {
      const decision = await evaluateZone('knee', 'DEGRADED')
      setDecisions((current) => ({ ...current, knee: decision }))
      if (decision.action !== 'HOLD' || decision.intensity !== 0 || decision.durationMinutes !== 0) throw new Error('Unsafe DEGRADED response')
    } catch {
      setApiFallback(true)
    }
    if (turnTimer.current) clearTimeout(turnTimer.current)
    turnTimer.current = setTimeout(async () => {
      setDegrade(false)
      try {
        const recovered = await evaluateZone('knee', 'GOOD')
        setDecisions((current) => ({ ...current, knee: recovered }))
      } catch {
        setApiFallback(true)
      }
    }, 6000)
  }

  const isHome = tab === 'titie'

  return (
    <div className="stage">
      <div className="device">
        <div className="screen">
          <StatusBar />

          {validationRoute ? (
            <div className="appbody scroll-dark"><ValidationScreen /></div>
          ) : isHome ? (
            // 全屏沉浸主页
            <HomeScreen degrade={degrade} decisions={decisions} apiFallback={apiFallback} onOpenRegion={openRegion} onTurn={simulateTurn}
              theme={theme} onToggleTheme={() => setTheme((t) => (t === 'night' ? 'day' : 'night'))} />
          ) : (
            <div className="appbody scroll-dark">
              {tab === 'sleep' && <SleepScreen onOpenFeedback={() => setFeedbackOpen(true)} />}
              {tab === 'me' && <MeScreen onTurn={simulateTurn} />}
            </div>
          )}

          {!validationRoute && <BottomNav active={tab} onChange={(t) => { setTab(t); setRegion(null) }} />}

          {/* Bottom Sheet — 身体区域详情 */}
          <RegionSheet regionKey={region} decision={region ? decisions[region] : null} apiFallback={apiFallback} onClose={() => setRegion(null)} />

          {/* 睡后反馈 —— 覆盖层，不进底部导航 */}
          {feedbackOpen && (
            <div className="screen" style={{ zIndex: 30 }}>
              <StatusBar />
              <FeedbackScreen onClose={() => setFeedbackOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
