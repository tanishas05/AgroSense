import { NextRequest, NextResponse } from 'next/server'

export interface LocationData {
  village: string       // most specific: hamlet / village / suburb
  district: string      // district / county
  state: string
  country: string
  display: string       // "Ozar, Nashik, Maharashtra"
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
    // OpenStreetMap Nominatim — free, no API key, village-level precision
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AgroSense/1.0 (agrosense.app)',
          'Accept-Language': 'en',
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) throw new Error('Nominatim error')

    const data = await res.json()
    const addr = data.address ?? {}

    // Priority: hamlet > village > suburb > neighbourhood > town > city_district > city
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