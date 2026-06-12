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
    <div className="rounded-2xl p-5 h-full" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-4xl font-semibold text-[#1a1a14]">📈 {t('mandiPrices')}</h2>
          <p className="text-4xl mt-0.5" style={{ color: '#8a8a7a' }}>{t('govtMandi')}</p>
        </div>
        <span className="text-4xl px-2 py-1 rounded-full"
          style={{ background: 'rgba(74,222,128,0.1)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.2)' }}>
          ● {t('live')}
        </span>
      </div>

      {prices.length === 0 ? (
        <div className="space-y-2.5">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(74,222,128,0.04)' }} />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {prices.map(({ crop, price, change, up, market }) => (
            <div key={crop} className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
              style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(22,163,74,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)')}>
              <div>
                <span className="text-4xl font-medium text-[#1a1a14]">{crop}</span>
                <span className="text-4xl ml-2" style={{ color: '#8a8a7a' }}>{market}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-semibold text-[#16a34a]">{price}/q</span>
                <span className="text-4xl font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: up ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                    color: up ? '#4ade80' : '#f87171',
                  }}>
                  {up ? '↑' : '↓'} {change ?? '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <p className="text-4xl font-medium" style={{ color: '#b45309' }}>📋 Government Mandi records</p>
        <p className="text-4xl mt-0.5" style={{ color: '#8a8a7a' }}>Updated every hour</p>
      </div>
    </div>
  )
}