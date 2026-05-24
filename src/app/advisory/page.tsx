import Navbar from '@/components/Navbar'
import DiseaseScanner from '@/components/advisory/DiseaseScanner'
import CropAdvisory from '@/components/advisory/CropAdvisory'
import PestAlerts from '@/components/advisory/PestAlerts'

export default function AdvisoryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-xs text-green-400 mb-1">AI-powered advisory 🤖</p>
          <h1 className="font-serif text-3xl text-green-50">Crop Advisory</h1>
          <p className="text-sm text-green-100/40 mt-1">AI disease detection · Personalized recommendations · Pest alerts</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <DiseaseScanner />
            <CropAdvisory />
          </div>
          <div>
            <PestAlerts />
          </div>
        </div>
      </div>
    </main>
  )
}