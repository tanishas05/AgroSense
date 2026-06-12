'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

const ICONS: Record<string, string> = { Rain:'🌧️', Clouds:'⛅', Clear:'☀️', Thunderstorm:'⛈️', Drizzle:'🌦️', Snow:'❄️', Haze:'🌫️', Mist:'🌫️', Fog:'🌫️' }
const icon = (main: string) => ICONS[main] ?? '🌤️'

export default function WeatherClient() {
  const { t } = useLang()
  const { location } = useLocation()
  const [current, setCurrent] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])

  useEffect(() => {
    if (!location) return
    Promise.all([
      fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}&type=current`).then(r => r.json()),
      fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}&type=forecast`).then(r => r.json()),
    ]).then(([c, f]) => {
      setCurrent(c)
      const seen = new Set<string>()
      setForecast(f.list?.filter((i: any) => {
        const d = new Date(i.dt * 1000).toLocaleDateString('en', { weekday: 'short' })
        if (seen.has(d)) return false; seen.add(d); return true
      }).slice(0, 7) ?? [])
    })
  }, [location])

  if (!current) return <div className="h-56 rounded-2xl animate-pulse" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }} />

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="p-5 pb-4" style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, transparent 60%)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-green-100 mb-1">{t('weatherForecast')}</h2>
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: 'rgba(74,222,128,0.6)' }}>📍</span>
              <span className="text-xs font-medium" style={{ color: '#86efac' }}>
                {location?.village ?? current.name}
                {location?.district && <span style={{ color: 'rgba(232,245,226,0.3)', fontWeight: 400 }}> · {location.district}</span>}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 10 }}>{t('live')}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold leading-none" style={{ color: '#86efac' }}>{Math.round(current.main.temp)}°</div>
            <div className="text-xs capitalize mt-1" style={{ color: 'rgba(232,245,226,0.4)' }}>
              {icon(current.weather[0].main)} {current.weather[0].description}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: t('humidity'), value: `${current.main.humidity}%`, ic: '💧' },
            { label: t('wind'), value: `${Math.round(current.wind.speed * 3.6)}km/h`, ic: '🌬️' },
            { label: t('feelsLike'), value: `${Math.round(current.main.feels_like)}°C`, ic: '🌡️' },
            { label: t('visibility'), value: `${(current.visibility/1000).toFixed(1)}km`, ic: '👁️' },
          ].map(({ label, value, ic }) => (
            <div key={label} className="text-center p-2.5 rounded-xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)' }}>
              <div className="text-base mb-1">{ic}</div>
              <div className="text-sm font-semibold text-green-300">{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(232,245,226,0.3)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-4">
        <div className="grid grid-cols-7 gap-1">
          {forecast.map((item, i) => (
            <div key={item.dt} className="text-center py-2.5 px-1 rounded-xl"
              style={i===0?{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)'}:{}}>
              <div className="text-xs mb-1.5" style={{ color: 'rgba(232,245,226,0.35)' }}>
                {i===0 ? t('today') : new Date(item.dt*1000).toLocaleDateString('en',{weekday:'short'})}
              </div>
              <div className="text-lg mb-1">{icon(item.weather[0].main)}</div>
              <div className="text-xs font-semibold text-green-300">{Math.round(item.main.temp_max)}°</div>
              <div className="text-xs" style={{ color: 'rgba(232,245,226,0.25)' }}>{Math.round(item.main.temp_min)}°</div>
              {item.pop > 0 && <div className="text-xs mt-1" style={{ color: '#60a5fa' }}>{Math.round(item.pop*100)}%</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}