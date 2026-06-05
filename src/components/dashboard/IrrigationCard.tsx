'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

export default function IrrigationCard() {
  const { data: session } = useSession()
  const { t } = useLang()
  const { location } = useLocation()
  const [data, setData] = useState<any>(null)
  const [crops, setCrops] = useState<string[]>([])

  useEffect(() => {
    if (session?.user?.email)
      fetch(`/api/profile?email=${session.user.email}`).then(r => r.json()).then(p => setCrops(p?.crops ?? []))
  }, [session])

  useEffect(() => {
    if (!location) return
    fetch(`/api/farm-stats?lat=${location.lat}&lon=${location.lon}`).then(r => r.json()).then(setData)
  }, [location])

  const moisture = data ? Math.min(90, Math.max(30, 100 - data.humidity + 20)) : 62
  const needsWater = data?.irrigationNeeded
  const nextIrrigation = needsWater ? `${t('today')} · ${t('scheduleSoon')}` : `${t('tomorrow')} · 6:00 AM`
  const amount = data ? Math.round(20 + (data.temp - 25) * 0.5) : 25
  const fields = crops.slice(0, 3).map((crop, i) => ({
    name: crop,
    moisture: i === 0 ? moisture : i === 1 ? Math.max(30, moisture - 14) : Math.min(90, moisture + 9),
  }))
  const moistureColor = moisture < 50 ? '#fbbf24' : moisture < 70 ? '#38bdf8' : '#4ade80'

  return (
    <div className="rounded-2xl p-5 h-full" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-green-100">💧 {t('smartIrrigation')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(74,222,128,0.5)' }}>{t('aiOptimized')}</p>
        </div>
        <div className="text-2xl font-bold" style={{ color: moistureColor }}>{moisture}%</div>
      </div>
      <div className="mb-4">
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${moisture}%`, background: `linear-gradient(90deg, ${moistureColor}80, ${moistureColor})` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'rgba(232,245,226,0.25)' }}>{t('soilMoisture')}</span>
          <span className="text-xs" style={{ color: 'rgba(232,245,226,0.25)' }}>{t('optimalRange')}</span>
        </div>
      </div>
      <div className="p-3 rounded-xl mb-4"
        style={{ background: needsWater ? 'rgba(251,191,36,0.06)' : 'rgba(74,222,128,0.05)', border: `1px solid ${needsWater ? 'rgba(251,191,36,0.2)' : 'rgba(74,222,128,0.12)'}` }}>
        <p className="text-xs mb-1" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('nextIrrigationSched')}</p>
        <p className="text-sm font-semibold" style={{ color: needsWater ? '#fde047' : '#86efac' }}>{nextIrrigation}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(232,245,226,0.4)' }}>{amount}mm · {Math.round(amount * 1.8)} min</p>
      </div>
      {fields.length > 0 && (
        <div className="space-y-2.5">
          {fields.map(({ name, moisture: m }) => (
            <div key={name}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'rgba(232,245,226,0.5)' }}>{name}</span>
                <span style={{ color: m < 55 ? '#fbbf24' : '#4ade80' }}>{m < 55 ? t('needed') : t('good')}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${m}%`, background: m < 55 ? '#fbbf24' : '#38bdf8' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}