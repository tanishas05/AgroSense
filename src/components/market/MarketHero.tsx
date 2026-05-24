'use client'

import { useEffect, useState } from 'react'

export default function MarketHero() {
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mandi')
      .then(r => r.json())
      .then(data => { setPrices(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {loading ? (
        [1,2,3,4].map(i => (
          <div key={i} className="bg-green-950/60 border border-green-400/15 rounded-xl p-4 h-28 animate-pulse" />
        ))
      ) : prices.map(({ crop, price, change, up, market }) => (
        <div key={crop} className="bg-green-950/60 border border-green-400/15 rounded-xl p-4 hover:border-green-400/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-green-100/40">{crop}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
              {change}
            </span>
          </div>
          <div className="text-2xl font-bold text-green-300">{price}</div>
          <div className="text-[10px] text-green-100/30 mt-1">/quintal · {market}</div>
        </div>
      ))}
    </div>
  )
}