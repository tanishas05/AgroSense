'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const NOTIFICATIONS = [
  { key: 'weather', label: 'Weather Alerts', desc: 'Rain, heatwave, frost warnings' },
  { key: 'disease', label: 'Disease Alerts', desc: 'Risk detection based on conditions' },
  { key: 'market', label: 'Market Price Alerts', desc: 'Price rise/fall notifications' },
  { key: 'irrigation', label: 'Irrigation Reminders', desc: 'Smart irrigation schedule alerts' },
  { key: 'fertilizer', label: 'Fertilizer Reminders', desc: 'Application schedule reminders' },
  { key: 'sms', label: 'SMS Alerts', desc: 'Receive alerts via SMS (offline areas)' },
]

export default function NotificationSettings() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Record<string, boolean>>({
    weather: true, disease: true, market: true,
    irrigation: false, fertilizer: false, sms: false,
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data?.notifications) setSettings(data.notifications)
        setLoading(false)
      })
  }, [session])

  function toggle(key: string) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  async function handleSave() {
    if (!session?.user?.email) return
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, notifications: settings }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-48 animate-pulse" />

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-green-100 mb-4">Notification Preferences</h2>
      <div className="space-y-3 mb-4">
        {NOTIFICATIONS.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-green-400/8 last:border-0">
            <div>
              <p className="text-xs font-medium text-green-100">{label}</p>
              <p className="text-[10px] text-green-100/35 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${settings[key] ? 'bg-green-500' : 'bg-green-400/15'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings[key] ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="w-full py-2.5 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all"
      >
        {saved ? '✓ Saved!' : 'Save Notification Settings'}
      </button>
    </div>
  )
}