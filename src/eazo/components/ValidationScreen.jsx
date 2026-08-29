import React, { useEffect, useState } from 'react'
import { titieApi } from '../../services/titieApi.js'

export default function ValidationScreen() {
  const [report, setReport] = useState(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => { titieApi.getValidation().then(setReport).catch(() => setFailed(true)) }, [])
  return <div className="validation-screen">
    <div className="page-head"><div className="ph-title">技术验证</div></div>
    <p className="validation-boundary">Prototype Simulation — 用于验证控制策略，不代表真实人体或临床效果。</p>
    {report?.reports?.map((item) => <div className="stat-card validation-card" key={item.strategy}>
      <div className="stat-lead">{item.strategy}</div>
      {Object.entries(item.metrics).map(([key, value]) => <div className="stat-row" key={key}><span className="stat-l">{key}</span><span className="stat-v">{Number(value).toFixed(2)}</span></div>)}
    </div>)}
    {!report && <div className="stat-foot">{failed ? '验证 API 暂不可用。' : '正在读取验证结果…'}</div>}
  </div>
}
