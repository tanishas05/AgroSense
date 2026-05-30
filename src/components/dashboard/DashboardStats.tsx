'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

export default function DashboardStats() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [stats, setStats] = useState<any>(null)
  const [scansCount, setScansCount] = useState(0)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      p => fetch(`/api/farm-stats?lat=${p.coords.latitude}&lon=${p.coords.longitude}`).then(r => r.json()).then(setStats),
      () => fetch('/api/farm-stats').then(r => r.json()).then(setStats)
    )
  }, [])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(d => setScansCount(d.stats?.scans ?? 0))
  }, [session])

  const items = stats ? [
    { label: t('cropHealthScore'), value: stats.cropHealth, sub: stats.cropHealthChange, ok: stats.cropHealthPositive },
    { label: t('waterUsedToday'), value: stats.waterUsed, sub: stats.waterChange, ok: stats.waterPositive },
    { label: t('fertilizerSaved'), value: `₹${(scansCount * 620).toLocaleString('en-IN')}`, sub: `${scansCount} AI scans`, ok: true },
    { label: t('irrigationStatus'), value: stats.irrigationNeeded ? t('needed') : t('good'), sub: stats.irrigationNeeded ? t('scheduleSoon') : t('optimal'), ok: !stats.irrigationNeeded },
  ] : []

  if (!stats) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-green-950/60 border border-green-400/15 rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {items.map(({ label, value, sub, ok }) => (
        <div key={label} className="p-4 bg-green-950/60 border border-green-400/15 rounded-xl hover:border-green-400/25 transition-all">
          <p className="text-xs text-green-100/40 mb-2">{label}</p>
          <p className="text-2xl font-bold text-green-200 mb-1">{value}</p>
          <p className={`text-xs ${ok ? 'text-green-400' : 'text-red-400'}`}>{sub}</p>
        </div>
      ))}
    </div>
  )
}