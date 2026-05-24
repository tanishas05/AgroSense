'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DashboardHeader() {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState('Good morning')
  const [emoji, setEmoji] = useState('🌱')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) { setGreeting('Good morning'); setEmoji('🌅') }
    else if (hour >= 12 && hour < 17) { setGreeting('Good afternoon'); setEmoji('☀️') }
    else if (hour >= 17 && hour < 21) { setGreeting('Good evening'); setEmoji('🌾') }
    else { setGreeting('Good night'); setEmoji('🌙') }
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
      <p className="text-xs text-green-400 mb-1">{greeting} {emoji}</p>
      <h1 className="font-serif text-3xl text-green-50">{farmName} Dashboard</h1>
      <p className="text-sm text-green-100/40 mt-1">{location} · Live data</p>
    </div>
  )
}