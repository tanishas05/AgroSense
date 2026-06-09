'use client'
import { useEffect, useState } from 'react'
import { MANDI_ALL_COMMODITIES } from '@/lib/config'

export default function PriceTable() {
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(MANDI_ALL_COMMODITIES.map(async commodity => {
        try { return await fetch(`/api/mandi-single?commodity=${commodity}`).then(r => r.json()) }
        catch { return { crop: commodity, price: 'N/A', change: '0%', up: true, market: 'N/A', state: 'N/A' } }
      }))
      setPrices(results); setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = prices.filter(p => p.crop.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: '#1a1a14' }}>All Commodities</h2>
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg outline-none w-32"
          style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#1a1a14' }} />
      </div>
      <div className="space-y-1">
        <div className="grid grid-cols-4 px-2 pb-2 text-xs" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', color: '#b0b0a0', fontSize: 10 }}>
          <span>Commodity</span><span>Price/q</span><span>Change</span><span>Market</span>
        </div>
        {loading ? MANDI_ALL_COMMODITIES.map((_, i) => (
          <div key={i} className="h-8 rounded animate-pulse mx-2" style={{ background: 'rgba(0,0,0,0.04)' }} />
        )) : filtered.map(({ crop, price, change, up, market }) => (
          <div key={crop} className="grid grid-cols-4 items-center px-2 py-2 rounded-lg transition-all"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.025)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <span className="text-xs font-medium" style={{ color: '#1a1a14' }}>{crop}</span>
            <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>{price}</span>
            <span className="text-xs font-medium" style={{ color: up ? '#16a34a' : '#dc2626' }}>{change}</span>
            <span className="truncate" style={{ color: '#8a8a7a', fontSize: 10 }}>{market}</span>
          </div>
        ))}
      </div>
    </div>
  )
}