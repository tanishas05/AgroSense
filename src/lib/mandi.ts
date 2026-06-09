import { API_URLS, MANDI_RESOURCE_ID, MANDI_DEFAULT_COMMODITIES, MANDI_FETCH_LIMIT, CACHE_TTL } from '@/lib/config'

export async function getMandiPrices(commodity: string = 'Wheat') {
  const res = await fetch(
    `${API_URLS.dataGovIn}/${MANDI_RESOURCE_ID}?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[commodity]=${commodity}&limit=${MANDI_FETCH_LIMIT}`,
    { next: { revalidate: CACHE_TTL.mandiPrices } }
  )
  if (!res.ok) throw new Error('Failed to fetch mandi prices')
  return res.json()
}

export async function getAllMandiPrices() {
  const results = await Promise.all(
    MANDI_DEFAULT_COMMODITIES.map(async (commodity) => {
      try {
        const data = await getMandiPrices(commodity)
        const record = data.records?.[0]
        return {
          crop: commodity,
          price: record ? `₹${record.modal_price}` : 'N/A',
          market: record?.market ?? 'N/A',
          state: record?.state ?? 'N/A',
        }
      } catch {
        return { crop: commodity, price: 'N/A', market: 'N/A', state: 'N/A' }
      }
    })
  )
  return results
}