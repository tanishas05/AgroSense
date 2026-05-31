import Navbar from '@/components/Navbar'
import MarketHero from '@/components/market/MarketHero'
import PriceTable from '@/components/market/PriceTable'
import PriceTrends from '@/components/market/PriceTrends'

export default function MarketPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)', top: -100, right: -100 }} />
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-sm mb-1" style={{ color: '#fbbf24' }}>Live market data 📈</p>
          <h1 className="font-serif text-4xl mb-2 text-green-50">Mandi Price Intelligence</h1>
          <p className="text-base" style={{ color: 'rgba(232,245,226,0.45)' }}>Government Mandi prices · Updated every hour</p>
        </div>
        <MarketHero />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <PriceTrends />
          <PriceTable />
        </div>
      </div>
    </main>
  )
}