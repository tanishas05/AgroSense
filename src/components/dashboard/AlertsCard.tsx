'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AlertsCard() {
  const { data: session } = useSession()
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => generateAlerts(pos.coords.latitude, pos.coords.longitude),
      () => generateAlerts(28.6667, 77.2167)
    )
  }, [session])

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

      // Rain alert
      const rainDay = weather.list?.find((item: any) => item.pop > 0.7)
      if (rainDay) {
        const day = new Date(rainDay.dt * 1000).toLocaleDateString('en', { weekday: 'long' })
        newAlerts.push({
          type: 'warning',
          title: `Heavy rain expected ${day}`,
          desc: `${Math.round(rainDay.pop * 100)}% chance · Delay irrigation`,
          time: 'Just now',
        })
      }

      // Market alert
      const rising = mandi.find((m: any) => m.up && parseFloat(m.change) > 3)
      if (rising) {
        newAlerts.push({
          type: 'success',
          title: `${rising.crop} price rising`,
          desc: `${rising.market} · ${rising.change} · Good time to sell`,
          time: '1h ago',
        })
      }

      // Fungal risk based on real humidity
      if (humidity > 65) {
        newAlerts.push({
          type: 'danger',
          title: 'Fungal disease risk high',
          desc: `Humidity at ${Math.round(humidity)}% · Spray fungicide preventively`,
          time: '2h ago',
        })
      }

      // Heat stress based on real temp
      if (temp > 35) {
        newAlerts.push({
          type: 'warning',
          title: 'Heat stress alert',
          desc: `Temperature ${Math.round(temp)}°C · Water crops early morning`,
          time: '3h ago',
        })
      }

      // Fertilizer reminder based on day of week
      const dayOfWeek = new Date().getDay()
      if (dayOfWeek === 1 || dayOfWeek === 4) {
        newAlerts.push({
          type: 'info',
          title: 'Weekly fertilizer check',
          desc: 'Review NPK levels for your crops this week',
          time: 'Today',
        })
      }

      setAlerts(newAlerts)

      if (session?.user?.email && newAlerts.length > 0) {
        for (const alert of newAlerts) {
          await fetch('/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              type: alert.type,
              title: alert.title,
              description: alert.desc,
            }),
          })
        }
      }
    } catch {
      setAlerts([])
    }
  }

  const typeStyles: Record<string, any> = {
    warning: { dot: 'bg-yellow-400', bg: 'bg-yellow-400/5', border: 'border-yellow-400/15' },
    danger: { dot: 'bg-red-400', bg: 'bg-red-400/5', border: 'border-red-400/15' },
    success: { dot: 'bg-green-400', bg: 'bg-green-400/5', border: 'border-green-400/15' },
    info: { dot: 'bg-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/15' },
  }

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">Alerts</h2>
        <span className="text-[10px] px-2 py-0.5 bg-red-400/10 text-red-400 rounded-full">
          {alerts.length} new
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.length === 0 ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-14 bg-green-400/5 rounded-lg animate-pulse" />)}
          </div>
        ) : alerts.map(({ type, title, desc, time }, i) => {
          const s = typeStyles[type]
          return (
            <div key={i} className={`${s.bg} border ${s.border} rounded-lg p-3`}>
              <div className="flex items-start gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-100">{title}</p>
                  <p className="text-[10px] text-green-100/40 mt-0.5">{desc}</p>
                </div>
                <span className="text-[10px] text-green-100/25 flex-shrink-0">{time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}