'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

function icon(main: string) {
  const map: Record<string, string> = { Rain: '🌧️', Clouds: '⛅', Clear: '☀️', Thunderstorm: '⛈️', Drizzle: '🌦️', Snow: '❄️' }
  return map[main] ?? '🌤️'
}

export default function WeatherClient() {
  const { t } = useLang()
  const [current, setCurrent] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])

  useEffect(() => {
    async function load(lat: number, lon: number) {
      const [c, f] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`).then(r => r.json()),
        fetch(`/api/weather?lat=${lat}&lon=${lon}&type=forecast`).then(r => r.json()),
      ])
      setCurrent(c)
      const seen = new Set()
      setForecast(f.list?.filter((i: any) => {
        const d = new Date(i.dt * 1000).toLocaleDateString('en', { weekday: 'short' })
        if (seen.has(d)) return false
        seen.add(d)
        return true
      }).slice(0, 7) ?? [])
    }
    navigator.geolocation.getCurrentPosition(
      p => load(p.coords.latitude, p.coords.longitude),
      () => load(28.6667, 77.2167)
    )
  }, [])

  if (!current) return <div className="h-48 bg-green-950/60 border border-green-400/15 rounded-xl animate-pulse" />

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-green-100">{t('weatherForecast')}</h2>
          <p className="text-xs text-green-100/35 mt-0.5">{current.name} · {t('live')}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-300">{Math.round(current.main.temp)}°C</div>
          <div className="text-xs text-green-100/40 capitalize">{current.weather[0].description}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: t('humidity'), value: `${current.main.humidity}%` },
          { label: t('wind'), value: `${Math.round(current.wind.speed * 3.6)}km/h` },
          { label: t('feelsLike'), value: `${Math.round(current.main.feels_like)}°C` },
          { label: t('visibility'), value: `${(current.visibility / 1000).toFixed(1)}km` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-green-400/5 border border-green-400/10 rounded-lg p-2.5 text-center">
            <div className="text-sm font-semibold text-green-300">{value}</div>
            <div className="text-xs text-green-100/35 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {forecast.map((item, i) => (
          <div key={item.dt} className={`text-center p-2 rounded-lg ${i === 0 ? 'bg-green-400/10 border border-green-400/20' : ''}`}>
            <div className="text-xs text-green-100/40 mb-1">{i === 0 ? t('today') : new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}</div>
            <div className="text-lg mb-1">{icon(item.weather[0].main)}</div>
            <div className="text-xs font-semibold text-green-300">{Math.round(item.main.temp_max)}°</div>
            <div className="text-xs text-green-100/30">{Math.round(item.main.temp_min)}°</div>
            <div className="text-xs text-blue-400 mt-1">{item.pop ? `${Math.round(item.pop * 100)}%` : '0%'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}