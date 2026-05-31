import Navbar from '@/components/Navbar'
import DiseaseScanner from '@/components/advisory/DiseaseScanner'
import CropAdvisory from '@/components/advisory/CropAdvisory'
import PestAlerts from '@/components/advisory/PestAlerts'

export default function AdvisoryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', top: -100, right: -100 }} />
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-sm mb-1" style={{ color: '#a78bfa' }}>AI-powered advisory 🤖</p>
          <h1 className="font-serif text-4xl mb-2 text-green-50">Crop Advisory</h1>
          <p className="text-base" style={{ color: 'rgba(232,245,226,0.45)' }}>AI disease detection · Personalized recommendations · Pest alerts</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <DiseaseScanner />
            <CropAdvisory />
          </div>
          <div><PestAlerts /></div>
        </div>
      </div>
    </main>
  )
}