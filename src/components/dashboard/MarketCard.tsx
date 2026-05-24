'use client'

import { useEffect, useState } from 'react'

export default function MarketCard() {
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mandi')
      .then(r => r.json())
      .then(data => { setPrices(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">Mandi Prices</h2>
        <span className="text-[10px] px-2 py-1 bg-green-400/10 text-green-400 rounded-full">Live</span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-8 bg-green-400/5 rounded animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2.5">
          {prices.map(({ crop, price, change, up, market }) => (
            <div key={crop} className="flex items-center justify-between py-1.5 border-b border-green-400/8 last:border-0">
              <div>
                <span className="text-xs text-green-100/70">{crop}</span>
                <span className="text-[10px] text-green-100/30 ml-2">{market}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-green-300">{price}/q</span>
                <span className={`text-[11px] font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-400/8 border border-yellow-400/20 rounded-lg">
        <p className="text-[11px] text-yellow-300 font-medium">Data from Government Mandi records</p>
        <p className="text-[10px] text-green-100/40 mt-0.5">Updated every hour</p>
      </div>
    </div>
  )
}