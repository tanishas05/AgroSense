'use client'

import { useEffect, useState } from 'react'

function getWeatherIcon(main: string) {
  switch (main) {
    case 'Rain': return '🌧️'
    case 'Clouds': return '⛅'
    case 'Clear': return '☀️'
    case 'Thunderstorm': return '⛈️'
    case 'Drizzle': return '🌦️'
    case 'Snow': return '❄️'
    default: return '🌤️'
  }
}

export default function WeatherClient() {
  const [current, setCurrent] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')

  useEffect(() => {
    async function fetchWeather(lat: number, lon: number) {
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`),
          fetch(`/api/weather?lat=${lat}&lon=${lon}&type=forecast`),
        ])
        const currentData = await currentRes.json()
        const forecastData = await forecastRes.json()
        setCurrent(currentData)
        setCity(currentData.name)
        const seen = new Set()
        const days = forecastData.list?.filter((item: any) => {
          const day = new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' })
          if (seen.has(day)) return false
          seen.add(day)
          return true
        }).slice(0, 7) ?? []
        setForecast(days)
      } catch (e) {
        console.error('Weather error', e)
      } finally {
        setLoading(false)
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(28.6667, 77.2167) // fallback to Delhi
    )
  }, [])

  if (loading) {
    return <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-64 animate-pulse" />
  }

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-green-100">Weather Forecast</h2>
          <p className="text-xs text-green-100/35 mt-0.5">{city} · Live · Your location</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-300">
            {current ? `${Math.round(current.main.temp)}°C` : '--°C'}
          </div>
          <div className="text-xs text-green-100/40 capitalize">
            {current?.weather?.[0]?.description ?? ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Humidity', value: current ? `${current.main.humidity}%` : '--' },
          { label: 'Wind', value: current ? `${Math.round(current.wind.speed * 3.6)} km/h` : '--' },
          { label: 'Feels like', value: current ? `${Math.round(current.main.feels_like)}°C` : '--' },
          { label: 'Visibility', value: current ? `${(current.visibility / 1000).toFixed(1)}km` : '--' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-green-400/5 border border-green-400/10 rounded-lg p-2.5 text-center">
            <div className="text-sm font-semibold text-green-300">{value}</div>
            <div className="text-[10px] text-green-100/35 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {forecast.map((item: any, i: number) => {
          const day = i === 0 ? 'Today' : new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' })
          const icon = getWeatherIcon(item.weather[0].main)
          const high = Math.round(item.main.temp_max)
          const low = Math.round(item.main.temp_min)
          const rain = item.pop ? `${Math.round(item.pop * 100)}%` : '0%'
          return (
            <div key={item.dt} className={`text-center p-2 rounded-lg ${i === 0 ? 'bg-green-400/10 border border-green-400/20' : ''}`}>
              <div className="text-[10px] text-green-100/40 mb-1">{day}</div>
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-[11px] font-semibold text-green-300">{high}°</div>
              <div className="text-[10px] text-green-100/30">{low}°</div>
              <div className="text-[10px] text-blue-400 mt-1">{rain}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}