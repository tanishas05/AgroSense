'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

export default function DashboardHeader() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [greetingKey, setGreetingKey] = useState('goodMorning')
  const [emoji, setEmoji] = useState('🌅')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) { setGreetingKey('goodMorning'); setEmoji('🌅') }
    else if (hour >= 12 && hour < 17) { setGreetingKey('goodAfternoon'); setEmoji('☀️') }
    else if (hour >= 17 && hour < 21) { setGreetingKey('goodEvening'); setEmoji('🌾') }
    else { setGreetingKey('goodNight'); setEmoji('🌙') }
  }, [])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(setProfile)
  }, [session])

  const farmName = profile?.farm_name ?? 'Your Farm'
  const location = profile?.district && profile?.state
    ? `${profile.district}, ${profile.state}`
    : 'Your Location'

  return (
    <div className="mb-8">
      <p className="text-xs text-green-400 mb-1">{t(greetingKey)} {emoji}</p>
      <h1 className="font-serif text-3xl text-green-50">{farmName} {t('farmDashboard')}</h1>
      <p className="text-sm text-green-100/40 mt-1">{location} · {t('liveData')}</p>
    </div>
  )
}