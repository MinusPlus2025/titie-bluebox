import React, { useState, useEffect } from 'react'
import { StatusBar, BottomNav } from './components/Chrome.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import SleepScreen from './components/SleepScreen.jsx'
import MeScreen from './components/MeScreen.jsx'
import RegionSheet from './components/RegionSheet.jsx'
import FeedbackScreen from './components/FeedbackScreen.jsx'
import ValidationScreen from './components/ValidationScreen.jsx'
import { evaluateZone } from '../services/titieApi.js'

export default function App() {
  const [tab, setTab] = useState('titie')
  const [region, setRegion] = useState(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [degrade, setDegrade] = useState(false)
  const [decisions, setDecisions] = useState({})
  const [apiFallback, setApiFallback] = useState(false)
  const [validationRoute, setValidationRoute] = useState(window.location.pathname === '/validation')
  const [theme, setTheme] = useState('night')     // 'night' 冷蓝 / 'day' 暖白

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    Promise.all(['shoulder', 'knee'].map(async (key) => [key, await evaluateZone(key)]))
      .then((pairs) => setDecisions(Object.fromEntries(pairs)))
      .catch(() => setApiFallback(true))
    const onPop = () => setValidationRoute(window.location.pathname === '/validation')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

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
    setTimeout(() => setDegrade(false), 6000)
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
            <HomeScreen degrade={degrade} decisions={decisions} apiFallback={apiFallback} onOpenRegion={setRegion} onTurn={simulateTurn}
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
