'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

export default function NotificationSettings() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [settings, setSettings] = useState<Record<string, boolean> | null>(null)
  const [saved, setSaved] = useState(false)

  const NOTIFICATIONS = [
    { key: 'weather',    label: t('weatherAlerts'),       desc: t('weatherAlertsDesc'),       icon: '🌧️', accent: '#38bdf8' },
    { key: 'disease',    label: t('diseaseAlerts'),        desc: t('diseaseAlertsDesc'),        icon: '🔬', accent: '#a78bfa' },
    { key: 'market',     label: t('marketAlerts'),         desc: t('marketAlertsDesc'),         icon: '📈', accent: '#fbbf24' },
    { key: 'irrigation', label: t('irrigationReminders'),  desc: t('irrigationRemindersDesc'),  icon: '💧', accent: '#4ade80' },
    { key: 'fertilizer', label: t('fertilizerReminders'),  desc: t('fertilizerRemindersDesc'),  icon: '🌱', accent: '#34d399' },
    { key: 'sms',        label: t('smsAlerts'),            desc: t('smsAlertsDesc'),            icon: '📱', accent: '#fb923c' },
  ]

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        // Use whatever is saved in DB — no hardcoded defaults
        setSettings(data?.notifications ?? {})
      })
  }, [session])

  async function handleSave() {
    if (!session?.user?.email || !settings) return
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, notifications: settings }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return (
    <div className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }} />
  )

  return (
    <div className="p-5 rounded-2xl h-full flex flex-col" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🔔</span>
        <h2 className="text-sm font-semibold text-white">{t('notificationPrefs')}</h2>
      </div>

      <div className="space-y-1.5 mb-4 flex-1">
        {NOTIFICATIONS.map(({ key, label, desc, icon, accent }) => {
          const on = !!settings[key]
          return (
            <div key={key}
              className="flex items-center justify-between p-2.5 rounded-xl transition-all"
              style={{
                background: on ? `${accent}08` : 'rgba(74,222,128,0.02)',
                border: `1px solid ${on ? `${accent}20` : 'rgba(74,222,128,0.06)'}`,
              }}>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm flex-shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: on ? '#e8f5e2' : 'rgba(232,245,226,0.45)' }}>{label}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(232,245,226,0.2)' }}>{desc}</p>
                </div>
              </div>
              <button onClick={() => setSettings(s => ({ ...s!, [key]: !on }))}
                className="w-9 h-5 rounded-full transition-all relative flex-shrink-0 ml-2"
                style={{ background: on ? accent : 'rgba(74,222,128,0.1)' }}>
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: on ? '17px' : '2px' }} />
              </button>
            </div>
          )
        })}
      </div>

      <button onClick={handleSave}
        className="w-full py-2 text-xs font-semibold text-white rounded-xl transition-all"
        style={{ background: saved ? '#15803d' : '#16a34a' }}>
        {saved ? t('saved') : t('saveNotifications')}
      </button>
    </div>
  )
}