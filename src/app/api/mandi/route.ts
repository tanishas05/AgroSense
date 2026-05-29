import { NextResponse } from 'next/server'

export async function GET() {
  const commodities = ['Wheat', 'Onion', 'Tomato', 'Maize']

  const results = await Promise.all(
    commodities.map(async (commodity) => {
      try {
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters%5Bcommodity%5D=${commodity}&limit=3`
        const res = await fetch(url, { cache: 'no-store' })
        const data = await res.json()
        const record = data.records?.[0]
        const prev = data.records?.[1]

        const price = Number(record?.modal_price ?? 0)
        const prevPrice = Number(prev?.modal_price ?? price)
        const change = prevPrice > 0 ? (((price - prevPrice) / prevPrice) * 100).toFixed(1) : '0'

        return {
          crop: commodity,
          price: price > 0 ? `₹${price}` : 'N/A',
          change: `${Number(change) >= 0 ? '+' : ''}${change}%`,
          up: Number(change) >= 0,
          market: record?.market ?? 'N/A',
        }
      } catch {
        return { crop: commodity, price: 'N/A', change: '0%', up: true, market: 'N/A' }
      }
    })
  )

  return NextResponse.json(results)
}