'use client'

import { useEffect, useState } from 'react'

const ALL_COMMODITIES = [
  'Wheat', 'Onion', 'Tomato', 'Maize', 'Rice', 'Potato', 'Soybean', 'Cotton'
]

export default function PriceTable() {
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(
        ALL_COMMODITIES.map(async (commodity) => {
          try {
            const res = await fetch(
              `/api/mandi-single?commodity=${commodity}`
            )
            return await res.json()
          } catch {
            return { crop: commodity, price: 'N/A', change: '0%', up: true, market: 'N/A', state: 'N/A' }
          }
        })
      )
      setPrices(results)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = prices.filter(p =>
    p.crop.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">All Commodities</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-xs px-3 py-1.5 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 placeholder-green-100/30 outline-none focus:border-green-400/40 w-32"
        />
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-4 text-[10px] text-green-100/30 px-2 pb-2 border-b border-green-400/10">
          <span>Commodity</span>
          <span>Price/q</span>
          <span>Change</span>
          <span>Market</span>
        </div>
        {loading ? (
          [1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-8 bg-green-400/5 rounded animate-pulse mx-2" />
          ))
        ) : filtered.map(({ crop, price, change, up, market }) => (
          <div key={crop} className="grid grid-cols-4 items-center px-2 py-2 rounded-lg hover:bg-green-400/5 transition-all">
            <span className="text-xs text-green-100/70 font-medium">{crop}</span>
            <span className="text-xs font-semibold text-green-300">{price}</span>
            <span className={`text-xs font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
            <span className="text-[10px] text-green-100/30 truncate">{market}</span>
          </div>
        ))}
      </div>
    </div>
  )
}