'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

export default function MarketCard() {
  const { t } = useLang()
  const [prices, setPrices] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/mandi').then(r => r.json()).then(setPrices)
  }, [])

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">{t('mandiPrices')}</h2>
        <span className="text-xs px-2 py-1 bg-green-400/10 text-green-400 rounded-full">{t('live')}</span>
      </div>
      {prices.length === 0 ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-8 bg-green-400/5 rounded animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2.5">
          {prices.map(({ crop, price, change, up, market }) => (
            <div key={crop} className="flex items-center justify-between py-1.5 border-b border-green-400/8 last:border-0">
              <div>
                <span className="text-xs text-green-100/70">{crop}</span>
                <span className="text-xs text-green-100/30 ml-2">{market}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-green-300">{price}/q</span>
                <span className={`text-xs font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 p-3 bg-yellow-400/8 border border-yellow-400/20 rounded-lg">
        <p className="text-xs text-yellow-300 font-medium">Data from Government Mandi records</p>
        <p className="text-xs text-green-100/40 mt-0.5">Updated every hour</p>
      </div>
    </div>
  )
}