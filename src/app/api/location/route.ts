import { NextRequest, NextResponse } from 'next/server'
import { API_URLS, CACHE_TTL, NOMINATIM_USER_AGENT } from '@/lib/config'

export interface LocationData {
  village: string
  district: string
  state: string
  country: string
  display: string
  lat: number
  lon: number
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${API_URLS.nominatim}/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14&addressdetails=1`,
      {
        headers: {
          'User-Agent': NOMINATIM_USER_AGENT,
          'Accept-Language': 'en',
        },
        next: { revalidate: CACHE_TTL.location },
      }
    )

    if (!res.ok) throw new Error('Nominatim error')

    const data = await res.json()
    const addr = data.address ?? {}

    const village =
      addr.hamlet ??
      addr.village ??
      addr.suburb ??
      addr.neighbourhood ??
      addr.town ??
      addr.city_district ??
      addr.city ??
      'Your Village'

    const district =
      addr.district ??
      addr.county ??
      addr.city ??
      addr.state_district ??
      ''

    const state = addr.state ?? ''
    const display = [village, district, state].filter(Boolean).join(', ')

    return NextResponse.json({
      village, district, state,
      country: addr.country ?? 'India',
      display,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    } satisfies LocationData)
  } catch {
    return NextResponse.json({
      village: 'Your Village',
      district: '', state: '', country: 'India',
      display: 'Your Location',
      lat: parseFloat(lat), lon: parseFloat(lon),
    } satisfies LocationData)
  }
}