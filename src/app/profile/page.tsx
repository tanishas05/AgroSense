'use client'

import Navbar from '@/components/Navbar'
import ProfileCard from '@/components/profile/ProfileCard'
import FarmSettings from '@/components/profile/FarmSettings'
import NotificationSettings from '@/components/profile/NotificationSettings'
import LanguageSettings from '@/components/profile/LanguageSettings'
import { useLang } from '@/context/LanguageContext'
import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<{ children: ReactNode; name: string }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    if (this.state.error) return (
      <div className="p-4 rounded-2xl text-xs" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
        {this.props.name} failed to load. Check console.
      </div>
    )
    return this.props.children
  }
}

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
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '280px 1fr' }}>
          <ErrorBoundary name="ProfileCard"><ProfileCard /></ErrorBoundary>
          <ErrorBoundary name="FarmSettings"><FarmSettings /></ErrorBoundary>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: '280px 1fr' }}>
          <ErrorBoundary name="NotificationSettings"><NotificationSettings /></ErrorBoundary>
          <ErrorBoundary name="LanguageSettings"><LanguageSettings /></ErrorBoundary>
        </div>
      </div>
    </main>
  )
}