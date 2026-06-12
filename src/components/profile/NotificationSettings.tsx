'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

// These notifications are fully implemented (drive real AlertsCard logic)
const LIVE_NOTIFICATIONS = [
  { key: 'weather',    label: 'Weather Alerts',       desc: 'Rain and heatwave warnings',          icon: '🌧️', accent: '#38bdf8' },
  { key: 'disease',   label: 'Disease Alerts',        desc: 'Risk detection based on conditions',       icon: '🔬', accent: '#a78bfa' },
  { key: 'market',    label: 'Market Price Alerts',   desc: 'Price rise/fall notifications',            icon: '📈', accent: '#fbbf24' },
  { key: 'irrigation',label: 'Irrigation Alerts',     desc: 'Low moisture condition alerts',            icon: '💧', accent: '#4ade80' },
]

// These are not yet implemented — shown honestly as coming soon
const COMING_SOON = [
  { key: 'fertilizer', label: 'Fertilizer Reminders', desc: 'Scheduled application reminders',  icon: '🌱', accent: '#34d399' },
  { key: 'sms',        label: 'SMS Alerts',            desc: 'Alerts via SMS for offline areas', icon: '📱', accent: '#fb923c' },
]

export default function NotificationSettings() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [settings, setSettings] = useState<Record<string, boolean> | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => setSettings(data?.notifications ?? {}))
  }, [session])

  async function handleSave() {
    if (!session?.user?.email || !settings) return
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, notifications: settings }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!settings) return (
    <div className="rounded-2xl animate-pulse" style={{ height: 300, background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} />
  )

  const enabledCount = LIVE_NOTIFICATIONS.filter(n => !!settings[n.key]).length

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>🔔</div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#111111' }}>{t('notificationPrefs')}</h2>
            <p className="text-xs" style={{ color: '#8a8a7a' }}>{enabledCount} of {LIVE_NOTIFICATIONS.length} enabled</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Live notification toggles */}
        <div className="space-y-2 mb-4">
          {LIVE_NOTIFICATIONS.map(({ key, label, desc, icon, accent }) => {
            const on = !!settings[key]
            return (
              <div key={key}
                className="flex items-center justify-between px-3 py-3 rounded-xl transition-all cursor-pointer"
                style={{
                  background: on ? `${accent}07` : 'rgba(0,0,0,0.015)',
                  border: `1px solid ${on ? `${accent}18` : 'rgba(0,0,0,0.07)'}`,
                }}
                onClick={() => setSettings(s => ({ ...s!, [key]: !on }))}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: on ? `${accent}12` : 'rgba(0,0,0,0.03)', border: `1px solid ${on ? `${accent}25` : 'rgba(0,0,0,0.07)'}` }}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: on ? '#1a1a14' : '#8a8a7a' }}>{label}</p>
                    <p className="text-xs truncate" style={{ color: '#b0b0a0' }}>{desc}</p>
                  </div>
                </div>
                {/* Toggle */}
                <div className="flex-shrink-0 ml-3 transition-all"
                  style={{ background: on ? accent : 'rgba(0,0,0,0.1)', width: 40, height: 22, borderRadius: 11, position: 'relative' }}>
                  <div className="absolute rounded-full bg-white transition-all"
                    style={{ width: 18, height: 18, top: 2, left: on ? 20 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming soon section */}
        <div className="mb-5">
          <p className="text-xs font-medium mb-2 px-1" style={{ color: '#b0b0a0' }}>Coming soon</p>
          <div className="space-y-2">
            {COMING_SOON.map(({ key, label, desc, icon, accent }) => (
              <div key={key}
                className="flex items-center justify-between px-3 py-3 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', opacity: 0.6 }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium" style={{ color: '#8a8a7a' }}>{label}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(251,191,36,0.1)', color: '#d97706', fontSize: 9, border: '1px solid rgba(251,191,36,0.2)' }}>
                        Soon
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: '#c0c0b0' }}>{desc}</p>
                  </div>
                </div>
                {/* Disabled toggle */}
                <div className="flex-shrink-0 ml-3"
                  style={{ background: 'rgba(0,0,0,0.08)', width: 40, height: 22, borderRadius: 11, position: 'relative' }}>
                  <div className="absolute rounded-full bg-white"
                    style={{ width: 18, height: 18, top: 2, left: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full py-2.5 text-xs font-semibold rounded-xl transition-all"
          style={{
            background: saved ? 'rgba(22,163,74,0.9)' : '#16a34a',
            color: 'white',
            boxShadow: saved ? 'none' : '0 4px 12px rgba(22,163,74,0.2)',
          }}>
          {saved ? '✓ ' + t('saved') : t('saveNotifications')}
        </button>
      </div>
    </div>
  )
}