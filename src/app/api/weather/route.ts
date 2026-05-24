import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const q = searchParams.get('q') ?? 'Nashik'

  const locationQuery = lat && lon ? `lat=${lat}&lon=${lon}` : `q=${q}`
  const endpoint = type === 'forecast' ? 'forecast' : 'weather'

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/${endpoint}?${locationQuery}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    { next: { revalidate: 1800 } }
  )

  const data = await res.json()
  return NextResponse.json(data)
}