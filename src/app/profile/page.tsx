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
      <div className="p-4 rounded-2xl text-4xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
        {this.props.name} failed to load.
      </div>
    )
    return this.props.children
  }
}

export default function ProfilePage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)'
      }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)'
      }} />

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: '#4ade80' }} />
              <span className="text-4xl font-medium tracking-widest uppercase" style={{ color: 'rgba(74,222,128,0.7)' }}>
                {t('accountSettingsTag')}
              </span>
            </div>
            <h1 className="font-serif text-5xl mb-2" style={{ color: '#111111', letterSpacing: '-0.02em' }}>
              {t('profileSettings')}
            </h1>
            <p className="text-4xl" style={{ color: 'rgba(30,30,20,0.4)' }}>{t('manageProfile')}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-4xl px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)', color: '#4ade80' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Auto-saves on submit
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: '300px 1fr', alignItems: 'start' }}>
          <ErrorBoundary name="ProfileCard"><ProfileCard /></ErrorBoundary>
          <ErrorBoundary name="FarmSettings"><FarmSettings /></ErrorBoundary>
        </div>

        {/* Row 2 */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '300px 1fr', alignItems: 'start' }}>
          <ErrorBoundary name="NotificationSettings"><NotificationSettings /></ErrorBoundary>
          <ErrorBoundary name="LanguageSettings"><LanguageSettings /></ErrorBoundary>
        </div>
      </div>
    </main>
  )
}