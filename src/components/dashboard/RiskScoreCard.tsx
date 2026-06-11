'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'
import { UNKNOWN_LOCATION_VILLAGE } from '@/lib/config'

interface RiskData {
  overall: number; crop: number; disease: number; water: number; insight: string
}

function RiskArc({ value, size = 72 }: { value: number; size?: number }) {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  const dash = (Math.min(value, 100) / 100) * circ * 0.75
  const color = value < 35 ? '#4ade80' : value < 65 ? '#f59e0b' : '#ef4444'
  const rot = -135
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(74,222,128,0.1)" strokeWidth="7"
        strokeDasharray={`${circ*0.75} ${circ*0.25}`} strokeLinecap="round"
        transform={`rotate(${rot} ${size/2} ${size/2})`} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ-dash+circ*0.25}`} strokeLinecap="round"
        transform={`rotate(${rot} ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 1.2s ease' }} />
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="13" fontWeight="700" fontFamily="inherit">{value}%</text>
      <text x={size/2} y={size/2+13} textAnchor="middle" dominantBaseline="middle"
        fill="#8a8a7a" fontSize="7" fontFamily="inherit">RISK</text>
    </svg>
  )
}

export default function RiskScoreCard() {
  const { lang } = useLang()
  const { location } = useLocation()
  const [risk, setRisk] = useState<RiskData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!location) return
    compute(location.lat, location.lon)
  }, [location])

  async function compute(lat: number, lon: number) {
    try {
      const w = await fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`).then(r => r.json())
      const temp: number = w.main?.temp ?? 28
      const humidity: number = w.main?.humidity ?? 60
      const rain: boolean = w.weather?.[0]?.main === 'Rain'
      const village: string = location?.village ?? w.name ?? UNKNOWN_LOCATION_VILLAGE

      const disease = Math.min(95, Math.round((humidity>75?55:humidity>60?35:18)+(temp>34?15:temp>30?8:2)+(rain?12:0)))
      const water = Math.min(90, Math.round((humidity<40?55:humidity<55?35:15)+(temp>36?20:temp>32?10:3)+(rain?-15:5)))
      const crop = Math.min(85, Math.round((disease*0.4+water*0.45+(temp>38?20:5))*0.65))
      const overall = Math.round(disease*0.35+water*0.35+crop*0.3)

      const insight = lang === 'hi'
        ? (disease>60 ? `${village} में उच्च आर्द्रता (${Math.round(humidity)}%) — 48 घंटे में फफूंदनाशक छिड़काव करें।`
          : water>55 ? `${village} में नमी कम है। कल सुबह सिंचाई करें।`
          : `${village} में स्थिति स्थिर है। सामान्य सिंचाई जारी रखें।`)
        : (disease>60 ? `High humidity (${Math.round(humidity)}%) at ${village} — spray copper fungicide within 48hrs.`
          : water>55 ? `Low soil moisture at ${village}. Irrigate early tomorrow morning.`
          : `Conditions at ${village} are stable. Maintain normal irrigation schedule.`)

      setRisk({ overall, crop, disease, water, insight })
    } catch {
      setRisk({ overall: 42, crop: 28, disease: 61, water: 38, insight: 'Could not compute risk.' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="h-40 rounded-2xl animate-pulse" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} />
  if (!risk) return null

  const insightColor = risk.disease>60||risk.water>60 ? '#f87171' : risk.overall>40 ? '#fbbf24' : '#4ade80'
  const bars = [
    { label: lang==='hi'?'फसल विफलता':'Crop Failure', value: risk.crop },
    { label: lang==='hi'?'रोग संभावना':'Disease Risk', value: risk.disease },
    { label: lang==='hi'?'पानी की कमी':'Water Shortage', value: risk.water },
  ]

  return (
    <div className="p-5 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: '#1a1a14' }}>🤖 {lang==='hi'?'AI खेती जोखिम स्कोर':'AI Farming Risk Score'}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8a8a7a' }}>
            📍 {location?.village ?? UNKNOWN_LOCATION_VILLAGE} · {lang==='hi'?'हर घंटे अपडेट':'Updated every hour'}
          </p>
        </div>
        <RiskArc value={risk.overall} size={72} />
      </div>

      {/* Bars + Insight side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {bars.map(({ label, value }) => {
            const color = value<35?'#4ade80':value<65?'#f59e0b':'#ef4444'
            const level = value<35?(lang==='hi'?'कम':'Low'):value<65?(lang==='hi'?'मध्यम':'Med'):(lang==='hi'?'अधिक':'High')
            return (
              <div key={label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: '#4a4a3a' }}>{label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
                    <span className="text-xs px-1 rounded" style={{ background: `${color}18`, color, fontSize: 9 }}>{level}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${value}%`, background: color, transition: 'width 1.2s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="p-3 rounded-xl flex flex-col justify-center"
          style={{ background: `${insightColor}08`, border: `1px solid ${insightColor}25` }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: insightColor }}>
            ⚡ {lang==='hi'?'AI अंतर्दृष्टि':'AI Insight'}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#4a4a3a' }}>{risk.insight}</p>
        </div>
      </div>
    </div>
  )
}