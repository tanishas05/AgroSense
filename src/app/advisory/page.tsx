'use client'

import Navbar from '@/components/Navbar'
import DiseaseScanner from '@/components/advisory/DiseaseScanner'
import CropAdvisory from '@/components/advisory/CropAdvisory'
import PestAlerts from '@/components/advisory/PestAlerts'
import VoiceAdvisory from '@/components/advisory/VoiceAdvisory'
import { useLang } from '@/context/LanguageContext'

export default function AdvisoryPage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-xs mb-1 text-green-400">{t('aiAdvisoryTag')}</p>
          <h1 className="font-serif text-4xl mb-2 text-green-50">{t('cropAdvisory')}</h1>
          <p className="text-sm text-green-100/45">{t('aiDetection')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <DiseaseScanner />
            <CropAdvisory />
            <VoiceAdvisory />
          </div>
          <div><PestAlerts /></div>
        </div>
      </div>
    </main>
  )
}