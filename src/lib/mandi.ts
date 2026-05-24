export async function getMandiPrices(commodity: string = 'Wheat') {
  const res = await fetch(
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[commodity]=${commodity}&limit=5`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Failed to fetch mandi prices')
  return res.json()
}

export async function getAllMandiPrices() {
  const commodities = ['Wheat', 'Onion', 'Tomato', 'Maize']
  const results = await Promise.all(
    commodities.map(async (commodity) => {
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
