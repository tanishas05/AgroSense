'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

export default function ProfileCard() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [stats, setStats] = useState({ scans: 0, alerts: 0 })
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setStats({ scans: data?.stats?.scans ?? 0, alerts: data?.stats?.alerts ?? 0 })
      })
  }, [session])

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>
      {/* Top gradient band */}
      <div className="h-20 relative" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)'
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)'
        }} />
        {/* Decorative dots */}
        <div className="absolute top-3 right-4 flex gap-1.5">
          {[0.3, 0.5, 0.8].map((o, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(74,222,128,${o})` }} />
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Avatar overlapping band */}
        <div className="relative -mt-10 mb-4">
          {session?.user?.image ? (
            <img src={session.user.image} alt="avatar"
              className="w-20 h-20 rounded-2xl object-cover"
              style={{ border: '3px solid #f5f0e8', boxShadow: '0 0 0 1px rgba(74,222,128,0.3), 0 8px 24px rgba(0,0,0,0.4)' }} />
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'rgba(74,222,128,0.12)', border: '3px solid #f5f0e8', boxShadow: '0 0 0 1px rgba(74,222,128,0.3)' }}>
              👤
            </div>
          )}
          {/* Online dot */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: '#16a34a', border: '2px solid #f5f0e8' }}>
            <span style={{ fontSize: 9, color: '#1a1a1a', fontWeight: 700 }}>✓</span>
          </div>
        </div>

        {/* Name */}
        <h2 className="text-base font-semibold mb-0.5" style={{ color: '#111111', letterSpacing: '-0.01em' }}>
          {session?.user?.name ?? '—'}
        </h2>
        <p className="text-xs mb-3" style={{ color: '#8a8a7a', fontFamily: 'monospace' }}>
          {session?.user?.email ?? '—'}
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg mb-5"
          style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#16a34a' }}>
          <span style={{ fontSize: 10 }}>🌱</span>
          {t('verifiedFarmer')}
        </div>

        {/* Divider */}
        <div className="mb-4" style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: t('scansDone'), value: stats.scans, icon: '🔬', color: '#a78bfa' },
            { label: t('alerts'), value: stats.alerts, icon: '🔔', color: '#fbbf24' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="p-3 rounded-xl text-center"
              style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
              <div className="text-xl mb-1" style={{ filter: 'saturate(0.8)' }}>{icon}</div>
              <div className="text-2xl font-bold leading-none mb-1" style={{ color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
              <div className="text-xs" style={{ color: '#8a8a7a' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Member since */}
        <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.07)' }}>
          <span style={{ color: '#8a8a7a' }}>{t('memberSince')}</span>
          <span style={{ color: '#4a4a3a', fontFamily: 'monospace' }}>{joinDate}</span>
        </div>
      </div>
    </div>
  )
}