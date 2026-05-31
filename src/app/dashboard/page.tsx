import Navbar from '@/components/Navbar'
import DashboardStats from '@/components/dashboard/DashboardStats'
import WeatherCard from '@/components/dashboard/WeatherCard'
import CropHealthCard from '@/components/dashboard/CropHealthCard'
import MarketCard from '@/components/dashboard/MarketCard'
import IrrigationCard from '@/components/dashboard/IrrigationCard'
import AlertsCard from '@/components/dashboard/AlertsCard'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Suspense } from 'react'

function Skeleton({ h = 'h-40' }: { h?: string }) {
  return <div className={`${h} bg-green-950/60 border border-green-400/15 rounded-xl animate-pulse`} />
}

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen bg-[#0a1a0d] overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', top: -100, right: -100 }} />
      <div className="absolute pointer-events-none" style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', bottom: 0, left: 50 }} />
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <DashboardHeader />
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4">
            <Suspense fallback={<Skeleton h="h-64" />}>
              <WeatherCard />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IrrigationCard />
              <MarketCard />
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