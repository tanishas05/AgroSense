import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const commodity = searchParams.get('commodity') ?? 'Wheat'

  try {
    const res = await fetch(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[commodity]=${commodity}&limit=3`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const record = data.records?.[0]
    const prev = data.records?.[1]
    const price = record?.modal_price ?? 0
    const prevPrice = prev?.modal_price ?? price
    const change = prevPrice ? (((price - prevPrice) / prevPrice) * 100).toFixed(1) : '0'

    return NextResponse.json({
      crop: commodity,
      price: price ? `₹${price}` : 'N/A',
      change: `${Number(change) >= 0 ? '+' : ''}${change}%`,
      up: Number(change) >= 0,
      market: record?.market ?? 'N/A',
      state: record?.state ?? 'N/A',
      minPrice: record?.min_price ?? 'N/A',
      maxPrice: record?.max_price ?? 'N/A',
    })
  } catch {
    return NextResponse.json({
      crop: commodity, price: 'N/A', change: '0%', up: true, market: 'N/A', state: 'N/A'
    })
  }
}