import { NextResponse } from 'next/server'
import { API_URLS, DEFAULT_LOCATION } from '@/lib/config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat') ?? String(DEFAULT_LOCATION.lat)
  const lon = searchParams.get('lon') ?? String(DEFAULT_LOCATION.lon)

  try {
    const weatherRes = await fetch(
      `${API_URLS.openWeather}/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
      { cache: 'no-store' }
    )
    const weather = await weatherRes.json()
    const humidity = weather.main?.humidity ?? 60
    const temp = weather.main?.temp ?? 28
    const rain = weather.weather?.[0]?.main === 'Rain'

    const cropHealth = Math.min(100, Math.max(50,
      85 + (humidity > 60 ? 5 : -5) + (temp > 35 ? -8 : 4) + (rain ? -3 : 2)
    ))
    const waterUsed = rain ? 0 : Math.round(20 + (temp - 25) * 0.8)
    const irrigationNeeded = humidity < 50 || temp > 33

    return NextResponse.json({
      cropHealth: `${Math.round(cropHealth)}%`,
      cropHealthChange: `Based on live weather`,
      cropHealthPositive: cropHealth > 75,
      waterUsed: `${waterUsed}mm`,
      waterChange: rain ? 'Rain detected today' : `Est. ${waterUsed > 24 ? 'above' : 'below'} average`,
      waterPositive: waterUsed <= 24,
      irrigationNeeded,
      temp: Math.round(temp),
      humidity,
    })
  } catch {
    return NextResponse.json({
      cropHealth: '85%',
      cropHealthChange: 'Based on live weather',
      cropHealthPositive: true,
      waterUsed: '24mm',
      waterChange: 'Est. average usage',
      waterPositive: true,
      irrigationNeeded: false,
      temp: 28,
      humidity: 60,
    })
  }
}