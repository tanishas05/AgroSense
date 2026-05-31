'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '../../context/LanguageContext'

export default function ProfileCard() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [stats, setStats] = useState({ scans: 0, alerts: 0 })
  const [profile, setProfile] = useState<any>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => { setProfile(data); setStats(data.stats ?? { scans: 0, alerts: 0 }) })
  }, [session])

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
    : 'Recently'

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="text-center mb-5">
        {session?.user?.image ? (
          <img src={session.user.image} alt="avatar" className="w-20 h-20 rounded-full border-2 border-green-400/30 mx-auto mb-3" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-green-400/10 border-2 border-green-400/20 mx-auto mb-3 flex items-center justify-center text-2xl">👤</div>
        )}
        <h2 className="text-sm font-semibold text-green-100">{session?.user?.name ?? 'Farmer'}</h2>
        <p className="text-xs text-green-100/40 mt-0.5">{session?.user?.email ?? ''}</p>
        <p className="text-xs text-green-100/25 mt-0.5">{t('memberSince')} {joinDate}</p>
        <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full border border-green-400/20">{t('verifiedFarmer')}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { label: t('scansDone'), value: stats.scans },
          { label: t('alerts'), value: stats.alerts },
          { label: t('language'), value: profile?.language?.toUpperCase() ?? 'EN' },
          { label: 'Fields', value: profile?.crops?.length ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-green-400/5 border border-green-400/10 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-green-300">{value}</div>
            <div className="text-xs text-green-100/35">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <button onClick={() => setSaved(true)} className="w-full py-2.5 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all">
          {saved ? t('saved') : t('saveProfile')}
        </button>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full py-2.5 text-xs text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/5 transition-all">
          {t('signOut')}
        </button>
      </div>
    </div>
  )
}