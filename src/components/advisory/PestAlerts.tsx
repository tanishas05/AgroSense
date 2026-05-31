'use client'

import { useEffect, useState } from 'react'
import { useLang } from '../../context/LanguageContext'

export default function PestAlerts() {
  const { t } = useLang()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => fetchAlerts(pos.coords.latitude, pos.coords.longitude),
      () => fetchAlerts(28.6667, 77.2167)
    )
  }, [])

  async function fetchAlerts(lat: number, lon: number) {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`)
      const weather = await res.json()
      const temp = weather.main?.temp ?? 28
      const humidity = weather.main?.humidity ?? 60
      const desc = weather.weather?.[0]?.main ?? ''
      const generated = []

      if (humidity > 70) generated.push({ pest: 'Fungal Blight', risk: 'High', crops: 'Tomato, Potato', advice: `Humidity ${Math.round(humidity)}% — apply copper fungicide immediately.`, icon: '🍄' })
      if (temp > 32) generated.push({ pest: 'Aphids & Whitefly', risk: 'Medium', crops: 'Cotton, Wheat', advice: `${Math.round(temp)}°C favors aphids. Use neem oil spray in early morning.`, icon: '🐛' })
      if (desc === 'Rain' || desc === 'Drizzle') generated.push({ pest: 'Root Rot Risk', risk: 'High', crops: 'All crops', advice: 'Rain detected — ensure proper field drainage.', icon: '🌧️' })
      if (temp > 28 && humidity < 40) generated.push({ pest: 'Spider Mites', risk: 'Medium', crops: 'Cotton, Brinjal', advice: 'Hot dry conditions favor mites. Spray water on leaf undersides.', icon: '🕷️' })
      if (generated.length === 0) generated.push({ pest: 'No active threats', risk: 'Low', crops: 'All crops', advice: `${Math.round(temp)}°C, ${Math.round(humidity)}% humidity — conditions are not favorable for major pests.`, icon: '✅' })

      setAlerts(generated)
    } catch { setAlerts([]) }
    finally { setLoading(false) }
  }

  const riskColor: Record<string, string> = { High: '#f87171', Medium: '#fbbf24', Low: '#4ade80' }
  const riskBg: Record<string, string> = { High: 'rgba(248,113,113,0.1)', Medium: 'rgba(251,191,36,0.1)', Low: 'rgba(74,222,128,0.1)' }

  return (
    <div className="p-5 rounded-xl" style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">{t('pestAlerts')}</h2>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>{t('weatherBased')}</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'rgba(251,191,36,0.04)' }} />)}</div>
      ) : (
        <div className="space-y-3">
          {alerts.map(({ pest, risk, crops, advice, icon }) => (
            <div key={pest} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span className="text-xs font-semibold text-white">{pest}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: riskColor[risk], background: riskBg[risk], border: `1px solid ${riskColor[risk]}30` }}>{risk}</span>
              </div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Affects: {crops}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{advice}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
        <p className="text-xs font-medium" style={{ color: '#38bdf8' }}>{t('alertsBasedOnWeather')}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('riskAdjust')}</p>
      </div>
    </div>
  )
}