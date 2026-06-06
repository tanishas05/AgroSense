'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'
import { useLocation } from '@/context/LocationContext'

export default function CropAdvisory() {
  const { data: session } = useSession()
  const { t } = useLang()
  const { location } = useLocation()
  const router = useRouter()
  const [crops, setCrops] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [advisory, setAdvisory] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`).then(r => r.json()).then(data => {
      const c = data?.crops ?? []
      setCrops(c)
      if (c.length > 0) setSelected(c[0])
      setProfileLoading(false)
    })
  }, [session])

  useEffect(() => {
    if (!location) return
    fetch(`/api/weather?lat=${location.lat}&lon=${location.lon}&type=current`).then(r => r.json()).then(setWeather)
  }, [location])

  useEffect(() => {
    if (!weather || !selected) return
    setLoading(true)
    setAdvisory(null)
    fetch('/api/crop-advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: selected,
        weather: { temp: Math.round(weather.main?.temp ?? 28), humidity: weather.main?.humidity ?? 60, description: weather.weather?.[0]?.description ?? 'clear' },
        village: location?.village ?? null,
        district: location?.district ?? null,
        state: location?.state ?? null,
      }),
    }).then(r => r.json()).then(d => { setAdvisory(d); setLoading(false) }).catch(() => setLoading(false))
  }, [selected, weather])

  if (profileLoading) return <div className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }} />

  const advCards = [
    { icon: '💧', label: t('irrigation'), key: 'irrigation', color: '#38bdf8', bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.15)' },
    { icon: '🌱', label: t('fertilizer'), key: 'fertilizer', color: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.15)' },
    { icon: '🐛', label: t('pestControl'), key: 'pestControl', color: '#fbbf24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.15)' },
    { icon: '🌾', label: t('harvesting'), key: 'harvesting', color: '#a78bfa', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.15)' },
  ]

  return (
    <div className="p-5 rounded-2xl" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">🌿 {t('personalizedAdvisory')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(74,222,128,0.5)' }}>
            {location?.display ? `📍 ${location.display} · AI advice` : t('aiAdviceBasedOn')}
          </p>
        </div>
        {location?.village && (
          <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
            style={{ background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.18)' }}>
            Village-specific ✓
          </span>
        )}
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('noCropsYet')}</p>
          <button onClick={() => router.push('/profile')} className="text-xs px-4 py-2 rounded-xl"
            style={{ color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>{t('setCropsInProfile')}</button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {crops.map(crop => (
              <button key={crop} onClick={() => setSelected(crop)}
                className="text-xs px-3 py-1.5 rounded-xl transition-all"
                style={selected === crop
                  ? { background: 'rgba(74,222,128,0.15)', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)' }
                  : { color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {crop}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(74,222,128,0.04)' }} />)}
            </div>
          ) : advisory ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {advCards.map(({ icon, label, key, color, bg, border }) => (
                  <div key={key} className="p-3 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{icon}</span>
                      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{advisory[key]}</p>
                  </div>
                ))}
              </div>
              {advisory.tips?.length > 0 && (
                <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-semibold text-white mb-2">{t('proTips')}</p>
                  <ul className="space-y-1.5">
                    {advisory.tips.map((tip: string, i: number) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <span style={{ color: '#4ade80' }}>→</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </>
      )}
    </div>
  )
}