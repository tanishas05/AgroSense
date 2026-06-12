'use client'

import { useEffect } from 'react'
import { useLocation } from '@/context/LocationContext'
import { DEFAULT_LOCATION, UNKNOWN_LOCATION_VILLAGE, UNKNOWN_LOCATION_DISPLAY } from '@/lib/config'
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
          setLocation({ lat, lon, village: UNKNOWN_LOCATION_VILLAGE, district: '', state: '', display: UNKNOWN_LOCATION_DISPLAY })
        }
      },
      () => setLocation({
        lat: DEFAULT_LOCATION.lat,
        lon: DEFAULT_LOCATION.lon,
        village: DEFAULT_LOCATION.village,
        district: DEFAULT_LOCATION.district,
        state: DEFAULT_LOCATION.state,
        display: DEFAULT_LOCATION.display,
      })
    )
  }, [])
  return null
}

export default function AdvisoryPage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <LocationInit />
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8">
          <span className="text-4xl font-medium px-2.5 py-1 rounded-full mb-3 inline-block"
            style={{ background: 'rgba(167,139,250,0.12)', color: '#7c3aed', border: '1px solid rgba(167,139,250,0.25)' }}>
            {t('aiAdvisoryTag')}
          </span>
          <h1 className="font-serif text-4xl mb-2" style={{ color: '#1a1a14' }}>{t('cropAdvisory')}</h1>
          <p className="text-4xl" style={{ color: '#6a6a5a' }}>{t('aiDetection')}</p>
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