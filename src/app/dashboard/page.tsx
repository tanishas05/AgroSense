'use client'

import { useEffect } from 'react'
import { useLocation } from '@/context/LocationContext'
import { DEFAULT_LOCATION, UNKNOWN_LOCATION_VILLAGE, UNKNOWN_LOCATION_DISPLAY } from '@/lib/config'
import Navbar from '@/components/Navbar'
import DashboardStats from '@/components/dashboard/DashboardStats'
import WeatherCard from '@/components/dashboard/WeatherCard'
import CropHealthCard from '@/components/dashboard/CropHealthCard'
import MarketCard from '@/components/dashboard/MarketCard'
import IrrigationCard from '@/components/dashboard/IrrigationCard'
import AlertsCard from '@/components/dashboard/AlertsCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import RiskScoreCard from '@/components/dashboard/RiskScoreCard'

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

export default function DashboardPage() {
  return (
    <main className="overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <LocationInit />
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <DashboardHeader />
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <WeatherCard />
          </div>
          <div>
            <CropHealthCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <RiskScoreCard />
          </div>
          <div>
            <AlertsCard />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IrrigationCard />
          <MarketCard />
        </div>
      </div>
    </main>
  )
}