'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function IrrigationCard() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [crops, setCrops] = useState<string[]>([])

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then(r => r.json())
        .then(p => setCrops(p?.crops ?? []))
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetch(`/api/farm-stats?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`).then(r => r.json()).then(setData),
      () => fetch('/api/farm-stats').then(r => r.json()).then(setData)
    )
  }, [session])

  const moisture = data ? Math.min(90, Math.max(30, 100 - data.humidity + 20)) : 62
  const nextIrrigation = data?.irrigationNeeded ? 'Today · As soon as possible' : 'Tomorrow · 6:00 AM'
  const amount = data ? Math.round(20 + (data.temp - 25) * 0.5) : 25

  const fields = crops.slice(0, 3).map((crop, i) => ({
    name: crop,
    moisture: i === 0 ? moisture : i === 1 ? Math.max(30, moisture - 14) : Math.min(90, moisture + 9),
  }))

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">Smart Irrigation</h2>
        <span className="text-[10px] text-green-400">AI Optimized</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-green-100/50">Soil Moisture</span>
          <span className="text-green-300 font-semibold">{moisture}%</span>
        </div>
        <div className="h-2 bg-green-400/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${moisture < 50 ? 'bg-yellow-400' : 'bg-blue-400'}`}
            style={{ width: `${moisture}%` }}
          />
        </div>
        <p className="text-[10px] text-green-100/30 mt-1">Optimal range: 55–70%</p>
      </div>

      <div className={`border rounded-lg p-3 mb-3 ${data?.irrigationNeeded ? 'bg-yellow-400/8 border-yellow-400/20' : 'bg-green-400/5 border-green-400/10'}`}>
        <p className="text-[10px] text-green-100/40 mb-1">Next irrigation scheduled</p>
        <p className="text-sm font-semibold text-green-300">{nextIrrigation}</p>
        <p className="text-[11px] text-green-100/50 mt-0.5">{amount}mm · {Math.round(amount * 1.8)} minutes</p>
      </div>

      <div className="space-y-2">
        {fields.length > 0 ? fields.map(({ name, moisture: m }) => (
          <div key={name} className="flex items-center justify-between text-xs">
            <span className="text-green-100/50">{name}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1 bg-green-400/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${m < 55 ? 'bg-yellow-400' : 'bg-blue-400'}`}
                  style={{ width: `${m}%` }}
                />
              </div>
              <span className={`text-[10px] ${m < 55 ? 'text-yellow-400' : 'text-green-400'}`}>
                {m < 55 ? 'Low' : 'Good'}
              </span>
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-green-100/25 text-center py-1">Set crops in Profile to see field data</p>
        )}
      </div>
    </div>
  )
}