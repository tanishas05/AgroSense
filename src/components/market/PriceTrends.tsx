'use client'
import { useEffect, useState } from 'react'
import { MANDI_DEFAULT_COMMODITIES } from '@/lib/config'

const COLORS: Record<string, string> = { Wheat: '#16a34a', Onion: '#ea580c', Tomato: '#dc2626', Maize: '#d97706' }

export default function PriceTrends() {
  const [selected, setSelected] = useState(MANDI_DEFAULT_COMMODITIES[0])
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mandi').then(r => r.json()).then(data => { setPrices(data); setLoading(false) })
  }, [])

  const currentPrice = prices.find(p => p.crop === selected)
  const rawPrice = currentPrice ? parseInt(currentPrice.price.replace('₹', '').replace(',', '')) : 2000

  // Illustrative trend based on today's price — not real historical data
  function generateIllustration(base: number) {
    const pts = []; let p = base * 0.88
    for (let i = 0; i < 7; i++) { p += (Math.random() - 0.4) * base * 0.03; pts.push(Math.round(p)) }
    pts.push(base); return pts
  }

  const trend = generateIllustration(rawPrice)
  const min = Math.min(...trend), max = Math.max(...trend), range = max - min || 1
  const W = 400, H = 120
  const pts = trend.map((p, i) => ({ x: (i / (trend.length - 1)) * W, y: H - ((p - min) / range) * H }))
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const color = COLORS[selected] ?? '#16a34a'

  return (
    <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: '#1a1a14' }}>Price Trend</h2>
          {/* Honest label — this is an illustration, not real historical data */}
          <p className="text-xs mt-0.5" style={{ color: '#b0b0a0' }}>Illustrative · based on today's price</p>
        </div>
        <div className="flex gap-1">
          {MANDI_DEFAULT_COMMODITIES.map(crop => (
            <button key={crop} onClick={() => setSelected(crop)}
              className="text-xs px-2.5 py-1 rounded-md transition-all"
              style={selected === crop
                ? { background: `${COLORS[crop]}12`, color: COLORS[crop], border: `1px solid ${COLORS[crop]}30` }
                : { color: '#8a8a7a', border: '1px solid transparent' }}>
              {crop}
            </button>
          ))}
        </div>
      </div>
      {loading ? <div className="h-32 animate-pulse rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }} /> : (
        <>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-2xl font-bold" style={{ color: '#1a1a14' }}>{currentPrice?.price ?? 'N/A'}</div>
              <div className="text-xs" style={{ color: '#8a8a7a' }}>per quintal · {currentPrice?.market}</div>
            </div>
            <div className="text-sm font-semibold px-3 py-1 rounded-lg"
              style={{ background: currentPrice?.up ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)', color: currentPrice?.up ? '#16a34a' : '#dc2626' }}>
              {currentPrice?.change}
            </div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
            <defs>
              <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${d} L ${W} ${H} L 0 ${H} Z`} fill="url(#fadeGrad)" />
            <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} opacity={i === pts.length - 1 ? 1 : 0.4} />)}
          </svg>
          <div className="flex justify-between mt-2" style={{ color: '#b0b0a0', fontSize: 10 }}>
            <span>Estimated range</span><span>Today</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[{ label: 'Min', value: `₹${min}` }, { label: 'Max', value: `₹${max}` }, { label: 'Avg', value: `₹${Math.round(trend.reduce((a, b) => a + b, 0) / trend.length)}` }].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="text-xs font-semibold" style={{ color: '#1a1a14' }}>{value}</div>
                <div style={{ color: '#8a8a7a', fontSize: 10 }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}