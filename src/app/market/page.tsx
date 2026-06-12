'use client'

import Navbar from '@/components/Navbar'
import MarketHero from '@/components/market/MarketHero'
import PriceTable from '@/components/market/PriceTable'
import PriceTrends from '@/components/market/PriceTrends'
import { useLang } from '@/context/LanguageContext'

export default function MarketPage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8">
          <p className="text-xs font-medium mb-1" style={{ color: '#16a34a' }}>Live market data 📈</p>
          <h1 className="font-serif text-4xl mb-2" style={{ color: '#1a1a14' }}>{t('mandiIntelligence')}</h1>
          <p className="text-sm" style={{ color: '#6a6a5a' }}>{t('govtMandi')}</p>
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