import Navbar from '@/components/Navbar'
import MarketHero from '@/components/market/MarketHero'
import PriceTable from '@/components/market/PriceTable'
import PriceTrends from '@/components/market/PriceTrends'

export default function MarketPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-xs text-green-400 mb-1">Live market data 📈</p>
          <h1 className="font-serif text-3xl text-green-50">Mandi Price Intelligence</h1>
          <p className="text-sm text-green-100/40 mt-1">Government Mandi prices · Updated every hour</p>
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