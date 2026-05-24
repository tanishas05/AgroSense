'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function DashboardStats() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [scansCount, setScansCount] = useState(0)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchStats(pos.coords.latitude, pos.coords.longitude),
      () => fetchStats(28.6667, 77.2167)
    )
  }, [])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => setScansCount(data.stats?.scans ?? 0))
  }, [session])

  async function fetchStats(lat: number, lon: number) {
    const res = await fetch(`/api/farm-stats?lat=${lat}&lon=${lon}`)
    const data = await res.json()
    setStats(data)
  }

  // Calculate fertilizer saved based on scans done
  const fertilizerSaved = scansCount > 0
    ? `₹${(scansCount * 620).toLocaleString('en-IN')}`
    : '₹0'

  const items = stats ? [
    {
      label: 'Crop Health Score',
      value: stats.cropHealth,
      change: stats.cropHealthChange,
      positive: stats.cropHealthPositive,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2a9 9 0 010 18A9 9 0 0112 2z"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
    },
    {
      label: 'Water Used Today',
      value: stats.waterUsed,
      change: stats.waterChange,
      positive: stats.waterPositive,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2C6 9 4 13 4 16a8 8 0 0016 0c0-3-2-7-8-14z"/>
        </svg>
      ),
    },
    {
      label: 'Fertilizer Saved',
      value: fertilizerSaved,
      change: `From ${scansCount} AI scans`,
      positive: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      label: 'Irrigation Status',
      value: stats.irrigationNeeded ? 'Needed' : 'Good',
      change: stats.irrigationNeeded ? 'Schedule soon' : 'Soil moisture optimal',
      positive: !stats.irrigationNeeded,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stats.irrigationNeeded ? '#fde047' : '#4ade80'} strokeWidth="2" strokeLinecap="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
    },
  ] : [1,2,3,4].map(i => ({ label: '', value: '', change: '', positive: true, icon: null, loading: true }))

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item: any, i) => (
        <div key={i} className="bg-green-950/60 border border-green-400/15 rounded-xl p-4 hover:border-green-400/30 transition-all">
          {item.loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-green-400/10 rounded w-3/4" />
              <div className="h-6 bg-green-400/10 rounded w-1/2" />
              <div className="h-2 bg-green-400/10 rounded w-2/3" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-green-100/40">{item.label}</span>
                <div className="w-8 h-8 bg-green-400/8 rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-green-300 mb-1">{item.value}</div>
              <div className={`text-[11px] ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                {item.change}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}