import { API_URLS, CACHE_TTL, WEATHER_FALLBACK_CITY } from '@/lib/config'

export async function getWeather(city: string = WEATHER_FALLBACK_CITY) {
  const res = await fetch(
    `${API_URLS.openWeather}/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    { next: { revalidate: CACHE_TTL.weather } }
  )
  if (!res.ok) throw new Error('Failed to fetch weather')
  return res.json()
}

export async function getCurrentWeather(city: string = WEATHER_FALLBACK_CITY) {
  const res = await fetch(
    `${API_URLS.openWeather}/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    { next: { revalidate: CACHE_TTL.weather } }
  )
  if (!res.ok) throw new Error('Failed to fetch current weather')
  return res.json()
}