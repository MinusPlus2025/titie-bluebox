// Shared line-icon set (no hearts / moons / flowers / female symbols)
import React from 'react'

const P = {
  titie: <><path d="M4 13c2-4 6-5 8-5s6 1 8 5"/><rect x="3" y="13" width="18" height="6" rx="3"/><path d="M6 13v-2a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2"/></>,
  sleep: <path d="M4 14c2-3 5-4 8-4s6 1 8 4M4 18h16M8 10V7M16 10V7"/>,
  me: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></>,
  warm: <><path d="M12 3v3M12 18v3M5 12H3M21 12h-2M6 6l1.4 1.4M18 6l-1.4 1.4"/><circle cx="12" cy="12" r="3.4"/></>,
  cool: <><path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9M12 6l-2.4 2M12 6l2.4 2M12 18l-2.4-2M12 18l2.4-2"/></>,
  steady: <><path d="M4 12h16"/><path d="M4 8h10M4 16h10"/></>,
  chev: <path d="M9 6l6 6-6 6"/>,
  left: <path d="M15 6l-6 6 6 6"/>,
  right: <path d="M9 6l6 6-6 6"/>,
  check: <path d="M5 13l4 4 10-11"/>,
  body: <><path d="M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="M12 8v6M9 10l3 1 3-1M10 20l2-6 2 6"/></>,
  box: <><rect x="4" y="4" width="16" height="16" rx="3"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></>,
  shield: <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  moon: <path d="M4 14c2-3 5-4 8-4s6 1 8 4M4 18h16"/>, // low bed, not a moon
  bed: <><path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 18h18M3 18v2M21 15v5M17 10h2a2 2 0 0 1 2 2v3"/></>,
  toggle: <><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="8" cy="12" r="2.4"/></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  people: <><circle cx="9" cy="9" r="3"/><path d="M3 19c0-3 3-4.5 6-4.5S15 16 15 19"/><path d="M16 6a3 3 0 0 1 0 6M21 19c0-2.4-1.6-3.8-3.5-4.3"/></>,
  refresh: <><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/></>,
  temp: <><path d="M12 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M10 9v6"/></>,
  humidity: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></>,
  neck: <><circle cx="12" cy="6" r="3"/><path d="M9 9c0 2-1 3-2 4M15 9c0 2 1 3 2 4M9 13h6"/></>,
  waist: <><path d="M8 4c0 3 1 5 1 8s-1 5-1 8M16 4c0 3-1 5-1 8s1 5 1 8"/><path d="M9 12h6"/></>,
  thigh: <><path d="M9 4v7c0 3-1 4-1 6a3 3 0 0 0 6 0c0-2-1-3-1-6V4"/></>,
  foot: <><path d="M8 4v9M8 13c-2 0-3 1-3 3s2 4 6 4h3a3 3 0 0 0 0-6c-2 0-3-1-3-2"/></>,
  knee: <><path d="M10 4v6M10 10c0 3 2 4 5 4a3 3 0 0 1 0 6"/><circle cx="10" cy="12" r="2"/></>,
  shoulder: <><circle cx="9" cy="7" r="2.5"/><path d="M6.5 10c-1.5 1-2.5 3-2.5 5M11.5 10c3 0 5 2 6 5"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></>,
  moondot: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>,
}

export default function Icon({ name, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {P[name] || null}
    </svg>
  )
}
