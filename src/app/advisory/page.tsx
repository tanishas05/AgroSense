'use client'

import { useEffect } from 'react'
import { useLocation } from '@/context/LocationContext'
import Navbar from '@/components/Navbar'
import DiseaseScanner from '@/components/advisory/DiseaseScanner'
import CropAdvisory from '@/components/advisory/CropAdvisory'
import PestAlerts from '@/components/advisory/PestAlerts'
import VoiceAdvisory from '@/components/advisory/VoiceAdvisory'
import { useLang } from '@/context/LanguageContext'

function LocationInit() {
  const { location, setLocation } = useLocation()
  useEffect(() => {
    if (location) return
    navigator.geolocation.getCurrentPosition(
      async p => {
        const { latitude: lat, longitude: lon } = p.coords
        try {
          const loc = await fetch(`/api/location?lat=${lat}&lon=${lon}`).then(r => r.json())
          setLocation({ lat, lon, village: loc.village, district: loc.district, state: loc.state, display: loc.display })
        } catch {
          setLocation({ lat, lon, village: 'Your Village', district: '', state: '', display: 'Your Location' })
        }
      },
      () => setLocation({ lat: 28.6667, lon: 77.2167, village: 'New Delhi', district: 'New Delhi', state: 'Delhi', display: 'New Delhi, Delhi' })
    )
  }, [])
  return null
}

export default function AdvisoryPage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <LocationInit />
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full mb-3 inline-block"
            style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
            {t('aiAdvisoryTag')}
          </span>
          <h1 className="font-serif text-4xl text-green-50 mb-2">{t('cropAdvisory')}</h1>
          <p className="text-sm" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('aiDetection')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2"><DiseaseScanner /></div>
          <div><PestAlerts /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><CropAdvisory /></div>
          <div><VoiceAdvisory /></div>
        </div>
      </div>
    </main>
  )
}