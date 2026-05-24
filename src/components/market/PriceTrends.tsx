'use client'

import { useEffect, useState } from 'react'

const CROPS = ['Wheat', 'Onion', 'Tomato', 'Maize']
const COLORS: Record<string, string> = {
  Wheat: '#4ade80',
  Onion: '#f97316',
  Tomato: '#ef4444',
  Maize: '#fde047',
}

export default function PriceTrends() {
  const [selected, setSelected] = useState('Wheat')
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mandi')
      .then(r => r.json())
      .then(data => { setPrices(data); setLoading(false) })
  }, [])

  const currentPrice = prices.find(p => p.crop === selected)

  // Generate a mock trend line based on current price
  function generateTrend(basePrice: number) {
    const points = []
    let price = basePrice * 0.88
    for (let i = 0; i < 7; i++) {
      price += (Math.random() - 0.4) * basePrice * 0.03
      points.push(Math.round(price))
    }
    points.push(basePrice)
    return points
  }

  const rawPrice = currentPrice ? parseInt(currentPrice.price.replace('₹', '').replace(',', '')) : 2000
  const trend = generateTrend(rawPrice)
  const min = Math.min(...trend)
  const max = Math.max(...trend)
  const range = max - min || 1

  const width = 400
  const height = 120
  const points = trend.map((p, i) => ({
    x: (i / (trend.length - 1)) * width,
    y: height - ((p - min) / range) * height,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const color = COLORS[selected] ?? '#4ade80'

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">Price Trend</h2>
        <div className="flex gap-1">
          {CROPS.map(crop => (
            <button
              key={crop}
              onClick={() => setSelected(crop)}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-all ${
                selected === crop
                  ? 'bg-green-400/20 text-green-300 border border-green-400/30'
                  : 'text-green-100/40 hover:text-green-300'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-32 animate-pulse bg-green-400/5 rounded-lg" />
      ) : (
        <>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-green-300">
                {currentPrice?.price ?? 'N/A'}
              </div>
              <div className="text-xs text-green-100/40">per quintal · {currentPrice?.market}</div>
            </div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-lg ${currentPrice?.up ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
              {currentPrice?.change}
            </div>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 120 }}>
            <defs>
              <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
              fill="url(#fadeGrad)"
            />
            <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} opacity={i === points.length - 1 ? 1 : 0.4} />
            ))}
          </svg>

          <div className="flex justify-between text-[10px] text-green-100/25 mt-2">
            <span>7 days ago</span>
            <span>Today</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Min', value: `₹${min}` },
              { label: 'Max', value: `₹${max}` },
              { label: 'Avg', value: `₹${Math.round(trend.reduce((a,b) => a+b,0)/trend.length)}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-green-400/5 border border-green-400/10 rounded-lg p-2 text-center">
                <div className="text-xs font-semibold text-green-300">{value}</div>
                <div className="text-[10px] text-green-100/30">{label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}