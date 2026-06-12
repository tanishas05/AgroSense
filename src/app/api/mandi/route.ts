import { NextResponse } from 'next/server'
import { API_URLS, MANDI_RESOURCE_ID, MANDI_DEFAULT_COMMODITIES } from '@/lib/config'

export async function GET() {
  const results = await Promise.all(
    MANDI_DEFAULT_COMMODITIES.map(async (commodity) => {
      try {
        const url = `${API_URLS.dataGovIn}/${MANDI_RESOURCE_ID}?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters%5Bcommodity%5D=${commodity}&limit=10`
        const res = await fetch(url, { cache: 'no-store' })
        const data = await res.json()
        const records: any[] = data.records ?? []
        const record = records[0]
        const price = Number(record?.modal_price ?? 0)

        // Only show price change if we find two records from the same market
        const sameMarketPrev = records.slice(1).find(
          (r: any) => r.market === record?.market && r.modal_price && r.modal_price !== record.modal_price
        )

        let change = '0'
        let hasChange = false
        if (sameMarketPrev) {
          const prevPrice = Number(sameMarketPrev.modal_price)
          if (prevPrice > 0) {
            change = (((price - prevPrice) / prevPrice) * 100).toFixed(1)
            hasChange = true
          }
        }

        return {
          crop: commodity,
          price: price > 0 ? `₹${price}` : 'N/A',
          change: hasChange ? `${Number(change) >= 0 ? '+' : ''}${change}%` : null,
          up: Number(change) >= 0,
          market: record?.market ?? 'N/A',
        }
      } catch {
        return { crop: commodity, price: 'N/A', change: null, up: true, market: 'N/A' }
      }
    })
  )

  return NextResponse.json(results)
}