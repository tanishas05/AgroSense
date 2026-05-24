import Navbar from '@/components/Navbar'
import DashboardStats from '@/components/dashboard/DashboardStats'
import WeatherCard from '@/components/dashboard/WeatherCard'
import CropHealthCard from '@/components/dashboard/CropHealthCard'
import MarketCard from '@/components/dashboard/MarketCard'
import IrrigationCard from '@/components/dashboard/IrrigationCard'
import AlertsCard from '@/components/dashboard/AlertsCard'
import { Suspense } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

function LoadingCard({ height = 'h-48' }: { height?: string }) {
  return <div className={`bg-green-950/60 border border-green-400/15 rounded-xl ${height} animate-pulse`} />
}

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen bg-[#0a1a0d] overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <DashboardHeader />
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4">
            <Suspense fallback={<LoadingCard height="h-64" />}>
              <WeatherCard />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IrrigationCard />
              <Suspense fallback={<LoadingCard />}>
                <MarketCard />
              </Suspense>
            </div>
          </div>
          <div className="space-y-4">
            <CropHealthCard />
            <AlertsCard />
          </div>
        </div>
      </div>
    </main>
  )
}