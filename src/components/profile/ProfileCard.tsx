'use client'

import Navbar from '@/components/Navbar'
import ProfileCard from '@/components/profile/ProfileCard'
import FarmSettings from '@/components/profile/FarmSettings'
import NotificationSettings from '@/components/profile/NotificationSettings'
import LanguageSettings from '@/components/profile/LanguageSettings'
import { useLang } from '@/context/LanguageContext'

export default function ProfilePage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-xs mb-1 text-green-400">{t('accountSettingsTag')}</p>
          <h1 className="font-serif text-4xl mb-2 text-green-50">{t('profileSettings')}</h1>
          <p className="text-sm" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('manageProfile')}</p>
        </div>

        {/* Row 1: Profile (narrow) + Farm Settings (wide) — equal height */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '280px 1fr', alignItems: 'stretch' }}>
          <div className="flex flex-col">
            <ProfileCard />
          </div>
          <div className="flex flex-col">
            <FarmSettings />
          </div>
        </div>

        {/* Row 2: Notifications (narrow) + Language (wide) — equal height */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '280px 1fr', alignItems: 'stretch' }}>
          <div className="flex flex-col">
            <NotificationSettings />
          </div>
          <div className="flex flex-col">
            <LanguageSettings />
          </div>
        </div>

      </div>
    </main>
  )
}