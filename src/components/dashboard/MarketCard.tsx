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
    <div className="rounded-2xl p-5 h-full" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-green-100">📈 {t('mandiPrices')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(232,245,226,0.3)' }}>{t('govtMandi')}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
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
              style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.06)')}>
              <div>
                <span className="text-xs font-medium text-green-100">{crop}</span>
                <span className="text-xs ml-2" style={{ color: 'rgba(232,245,226,0.3)' }}>{market}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-green-300">{price}/q</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: up ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                    color: up ? '#4ade80' : '#f87171',
                  }}>
                  {up ? '↑' : '↓'} {change}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
        <p className="text-xs font-medium" style={{ color: '#fde047' }}>📋 Government Mandi records</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(232,245,226,0.3)' }}>Updated every hour</p>
      </div>
    </div>
  )
}