'use client'

import { useEffect } from 'react'
import { useLocation } from '@/context/LocationContext'
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
          setLocation({ lat, lon, village: 'Your Village', district: '', state: '', display: 'Your Location' })
        }
      },
      () => setLocation({ lat: 28.6667, lon: 77.2167, village: 'New Delhi', district: 'New Delhi', state: 'Delhi', display: 'New Delhi, Delhi' })
    )
  }, [])
  return null
}

export default function DashboardPage() {
  return (
    <main className=" overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <LocationInit />
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <DashboardHeader />
        <DashboardStats />

        {/* Row 1: Weather (wide) + Crop Health (sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <WeatherCard />
          </div>
          <div>
            <CropHealthCard />
          </div>
        </div>

        {/* Row 2: Risk Score (wide) + Alerts (sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <RiskScoreCard />
          </div>
          <div>
            <AlertsCard />
          </div>
        </div>

        {/* Row 3: Irrigation + Market equally split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IrrigationCard />
          <MarketCard />
        </div>
      </div>
    </main>
  )
}