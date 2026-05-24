'use client'

import { useEffect, useState } from 'react'

export default function PestAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchAlerts(pos.coords.latitude, pos.coords.longitude),
      () => fetchAlerts(28.6667, 77.2167)
    )
  }, [])

  async function fetchAlerts(lat: number, lon: number) {
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`)
      const weather = await res.json()
      const temp = weather.main?.temp ?? 28
      const humidity = weather.main?.humidity ?? 60

      const generated = []

      if (humidity > 70) {
        generated.push({
          pest: 'Fungal Blight',
          risk: 'High',
          crops: 'Tomato, Potato',
          advice: 'Apply copper-based fungicide immediately. Ensure proper drainage.',
          icon: '🍄',
        })
      }

      if (temp > 32) {
        generated.push({
          pest: 'Aphids & Whitefly',
          risk: 'Medium',
          crops: 'Cotton, Wheat',
          advice: 'Use neem oil spray in early morning. Avoid chemical pesticides.',
          icon: '🐛',
        })
      }

      generated.push({
        pest: 'Stem Borer',
        risk: 'Low',
        crops: 'Rice, Maize',
        advice: 'Monitor crops weekly. Use pheromone traps for detection.',
        icon: '🪲',
      })

      generated.push({
        pest: 'Locust Warning',
        risk: 'Low',
        crops: 'All crops',
        advice: 'Check government alerts. Have pesticide ready if needed.',
        icon: '🦗',
      })

      setAlerts(generated)
    } catch {
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  const riskColor: Record<string, string> = {
    High: 'text-red-400 bg-red-400/10 border-red-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Low: 'text-green-400 bg-green-400/10 border-green-400/20',
  }

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">Pest Alerts</h2>
        <span className="text-[10px] px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
          Weather-based
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-green-400/5 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(({ pest, risk, crops, advice, icon }) => (
            <div key={pest} className="bg-green-400/3 border border-green-400/10 rounded-xl p-3 hover:border-green-400/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span className="text-xs font-semibold text-green-100">{pest}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${riskColor[risk]}`}>
                  {risk}
                </span>
              </div>
              <p className="text-[10px] text-green-100/40 mb-1.5">Affects: {crops}</p>
              <p className="text-[10px] text-green-100/55 leading-relaxed">{advice}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-400/5 border border-blue-400/15 rounded-lg">
        <p className="text-[11px] text-blue-300 font-medium">Alerts based on your weather</p>
        <p className="text-[10px] text-green-100/35 mt-0.5">Risk levels adjust to current conditions</p>
      </div>
    </div>
  )
}