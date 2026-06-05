'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

export default function AlertsCard() {
  const { data: session } = useSession()
  const { t } = useLang()
  const { location } = useLocation()
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    if (!location) return
    generateAlerts(location.lat, location.lon)
  }, [location])

  async function generateAlerts(lat: number, lon: number) {
    try {
      const [weatherRes, mandiRes] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}&type=forecast`),
        fetch('/api/mandi'),
      ])
      const weather = await weatherRes.json()
      const mandi = await mandiRes.json()
      const current = weather.list?.[0]
      const humidity = current?.main?.humidity ?? 50
      const temp = current?.main?.temp ?? 28
      const newAlerts: any[] = []

      const rainDay = weather.list?.find((item: any) => item.pop > 0.7)
      if (rainDay) {
        const day = new Date(rainDay.dt * 1000).toLocaleDateString('en', { weekday: 'long' })
        newAlerts.push({ type: 'warning', icon: '🌧️', title: `Heavy rain expected ${day}`, desc: `${Math.round(rainDay.pop * 100)}% chance · Delay irrigation`, time: 'Just now' })
      }
      const rising = mandi.find((m: any) => m.up && parseFloat(m.change) > 3)
      if (rising) newAlerts.push({ type: 'success', icon: '📈', title: `${rising.crop} price rising`, desc: `${rising.market} · ${rising.change}`, time: '1h ago' })
      if (humidity > 65) newAlerts.push({ type: 'danger', icon: '🍄', title: 'Fungal disease risk high', desc: `Humidity ${Math.round(humidity)}% · Spray fungicide`, time: '2h ago' })
      if (temp > 35) newAlerts.push({ type: 'warning', icon: '🌡️', title: 'Heat stress alert', desc: `${Math.round(temp)}°C · Water crops early morning`, time: '3h ago' })

      setAlerts(newAlerts)

      if (session?.user?.email && newAlerts.length > 0) {
        for (const alert of newAlerts) {
          await fetch('/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email, type: alert.type, title: alert.title, description: alert.desc }),
          })
        }
      }
    } catch { setAlerts([]) }
  }

  const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
    warning: { color: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.18)' },
    danger:  { color: '#f87171', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.18)' },
    success: { color: '#4ade80', bg: 'rgba(74,222,128,0.06)',  border: 'rgba(74,222,128,0.18)' },
    info:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.18)' },
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">🔔 {t('alertsTitle')}</h2>
        {alerts.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            {alerts.length} {t('newAlerts')}
          </span>
        )}
      </div>
      {alerts.length === 0 ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(74,222,128,0.04)' }} />)}</div>
      ) : (
        <div className="space-y-2">
          {alerts.map(({ type, icon, title, desc, time }, i) => {
            const cfg = typeConfig[type] ?? typeConfig.info
            return (
              <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: cfg.color }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(232,245,226,0.4)' }}>{desc}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'rgba(232,245,226,0.2)' }}>{time}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}