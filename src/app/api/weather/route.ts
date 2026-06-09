import { NextRequest, NextResponse } from 'next/server'
import { API_URLS, CACHE_TTL, WEATHER_FALLBACK_CITY } from '@/lib/config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const q = searchParams.get('q') ?? WEATHER_FALLBACK_CITY

  const locationQuery = lat && lon ? `lat=${lat}&lon=${lon}` : `q=${q}`
  const endpoint = type === 'forecast' ? 'forecast' : 'weather'

  const res = await fetch(
    `${API_URLS.openWeather}/${endpoint}?${locationQuery}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    { next: { revalidate: CACHE_TTL.weather } }
  )

  const data = await res.json()
  return NextResponse.json(data)
}