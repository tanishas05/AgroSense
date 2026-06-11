'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

export default function DashboardStats() {
  const { data: session } = useSession()
  const { t } = useLang()
  const { location } = useLocation()
  const [stats, setStats] = useState<any>(null)
  const [scansCount, setScansCount] = useState(0)

  useEffect(() => {
    if (!location) return
    fetch(`/api/farm-stats?lat=${location.lat}&lon=${location.lon}`).then(r => r.json()).then(setStats)
  }, [location])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`).then(r => r.json()).then(d => setScansCount(d.stats?.scans ?? 0))
  }, [session])

  if (!stats) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} />)}
    </div>
  )

  const irrigationOk = !stats.irrigationNeeded
  const items = [
    { icon: '🌿', label: t('cropHealthScore'), value: stats.cropHealth, sub: stats.cropHealthChange, ok: stats.cropHealthPositive, accent: '#4ade80', barWidth: parseInt(stats.cropHealth) },
    { icon: '💧', label: t('waterUsedToday'), value: stats.waterUsed, sub: stats.waterChange, ok: stats.waterPositive, accent: '#38bdf8', barWidth: null },
    { icon: '🔬', label: t('aiScansLabel'), value: `${scansCount}`, sub: t('totalScansRun'), ok: true, accent: '#a78bfa', barWidth: null },
    { icon: '🚿', label: t('irrigationStatus'), value: irrigationOk ? t('good') : t('needed'), sub: irrigationOk ? t('optimal') : t('scheduleSoon'), ok: irrigationOk, accent: irrigationOk ? '#4ade80' : '#fbbf24', barWidth: null },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {items.map(({ icon, label, value, sub, ok, accent, barWidth }) => (
        <div key={label} className="relative overflow-hidden p-4 rounded-2xl"
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs" style={{ color: '#8a8a7a' }}>{label}</span>
            <span className="text-base">{icon}</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: accent }}>{value}</div>
          <div className="text-xs" style={{ color: ok ? '#16a34a' : '#d97706' }}>{sub}</div>
          {barWidth !== null && (
            <div className="mt-3 h-1 rounded-full" style={{ background: 'rgba(74,222,128,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: accent }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}