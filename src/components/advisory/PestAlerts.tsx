'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

export default function PestAlerts() {
  const { t } = useLang()
  const { location } = useLocation()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!location) return
    fetchAlerts(location.lat, location.lon)
  }, [location])

  // Fallback if LocationContext not available on advisory page
  useEffect(() => {
    if (location) return
    navigator.geolocation.getCurrentPosition(
      p => fetchAlerts(p.coords.latitude, p.coords.longitude),
      () => fetchAlerts(28.6667, 77.2167)
    )
  }, [])

  async function fetchAlerts(lat: number, lon: number) {
    try {
      const w = await fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`).then(r => r.json())
      const temp = w.main?.temp ?? 28
      const humidity = w.main?.humidity ?? 60
      const desc = w.weather?.[0]?.main ?? ''
      const gen = []
      if (humidity > 70) gen.push({ pest: 'Fungal Blight', risk: 'High', crops: 'Tomato, Potato', advice: `Humidity ${Math.round(humidity)}% — apply copper fungicide immediately.`, icon: '🍄' })
      if (temp > 32) gen.push({ pest: 'Aphids & Whitefly', risk: 'Medium', crops: 'Cotton, Wheat', advice: `${Math.round(temp)}°C favors aphids. Use neem oil spray in early morning.`, icon: '🐛' })
      if (desc === 'Rain' || desc === 'Drizzle') gen.push({ pest: 'Root Rot Risk', risk: 'High', crops: 'All crops', advice: 'Rain detected — ensure proper field drainage.', icon: '🌧️' })
      if (temp > 28 && humidity < 40) gen.push({ pest: 'Spider Mites', risk: 'Medium', crops: 'Cotton, Brinjal', advice: 'Hot dry conditions favor mites. Spray water on leaf undersides.', icon: '🕷️' })
      if (gen.length === 0) gen.push({ pest: 'No active threats', risk: 'Low', crops: 'All crops', advice: `${Math.round(temp)}°C, ${Math.round(humidity)}% humidity — conditions are stable.`, icon: '✅' })
      setAlerts(gen)
    } catch { setAlerts([]) }
    finally { setLoading(false) }
  }

  const riskConfig: Record<string, { color: string; bg: string }> = {
    High:   { color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
    Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
    Low:    { color: '#16a34a', bg: 'rgba(74,222,128,0.08)' },
  }

  return (
    <div className="p-5 rounded-2xl h-full" style={{ background: 'white', border: '1px solid rgba(251,191,36,0.12)' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold" style={{ color: "#1a1a14" }}>🐛 {t('pestAlerts')}</h2>
        <span className="text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
          {t('weatherBased')}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'rgba(251,191,36,0.04)' }} />)}</div>
      ) : (
        <div className="space-y-3">
          {alerts.map(({ pest, risk, crops, advice, icon }) => {
            const cfg = riskConfig[risk] ?? riskConfig.Low
            return (
              <div key={pest} className="p-3.5 rounded-xl" style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs font-semibold" style={{ color: "#1a1a14" }} className="">{pest}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>{risk}</span>
                </div>
                <p className="text-xs mb-1.5" style={{ color: '#8a8a7a' }}>Affects: {crops}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#4a4a3a' }}>{advice}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
        <p className="text-xs font-medium" style={{ color: '#38bdf8' }}>{t('alertsBasedOnWeather')}</p>
        <p className="text-xs mt-0.5" style={{ color: '#8a8a7a' }}>{t('riskAdjust')}</p>
      </div>
    </div>
  )
}