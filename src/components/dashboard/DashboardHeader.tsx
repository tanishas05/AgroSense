'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

export default function DashboardHeader() {
  const { data: session } = useSession()
  const { t } = useLang()
  const { location } = useLocation()
  const [greetingKey, setGreetingKey] = useState<any>('goodMorning')
  const [emoji, setEmoji] = useState('🌅')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12)       { setGreetingKey('goodMorning');   setEmoji('🌅') }
    else if (h >= 12 && h < 17) { setGreetingKey('goodAfternoon'); setEmoji('☀️') }
    else if (h >= 17 && h < 21) { setGreetingKey('goodEvening');   setEmoji('🌾') }
    else                         { setGreetingKey('goodNight');     setEmoji('🌙') }
  }, [])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`).then(r => r.json()).then(setProfile)
  }, [session])

  const locDisplay = location?.display ?? (profile?.district && profile?.state ? `${profile.district}, ${profile.state}` : null)

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.18)' }}>
          {t(greetingKey)} {emoji}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(74,222,128,0.5)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          {t('liveData')}
        </span>
      </div>
      <h1 className="font-serif text-4xl text-green-50 leading-tight">
        {profile?.farm_name ?? 'My Farm'}{' '}
        <span style={{ color: 'rgba(240,253,244,0.45)' }}>{t('farmDashboard')}</span>
      </h1>
      {locDisplay && (
        <p className="text-sm mt-1.5 flex items-center gap-1.5" style={{ color: 'rgba(232,245,226,0.35)' }}>
          <span>📍</span>{locDisplay}
        </p>
      )}
    </div>
  )
}