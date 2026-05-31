'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLang } from '../../context/LanguageContext'

export default function CropAdvisory() {
  const { data: session } = useSession()
  const { t } = useLang()
  const router = useRouter()
  const [crops, setCrops] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [advisory, setAdvisory] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        const userCrops = data?.crops ?? []
        setCrops(userCrops)
        if (userCrops.length > 0) setSelected(userCrops[0])
        setProfileLoading(false)
      })
  }, [session])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&type=current`).then(r => r.json()).then(setWeather),
      () => fetch('/api/weather?q=Delhi&type=current').then(r => r.json()).then(setWeather)
    )
  }, [])

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
      }),
    })
      .then(r => r.json())
      .then(data => { setAdvisory(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selected, weather])

  if (profileLoading) return <div className="h-48 rounded-xl animate-pulse" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }} />

  return (
    <div className="p-5 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{t('personalizedAdvisory')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(74,222,128,0.5)' }}>{t('aiAdviceBasedOn')}</p>
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{crops.length} {t('cropsFromProfile')}</span>
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('noCropsYet')}</p>
          <button onClick={() => router.push('/profile')} className="text-xs px-4 py-2 rounded-lg" style={{ color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
            {t('setCropsInProfile')}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {crops.map(crop => (
              <button key={crop} onClick={() => setSelected(crop)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={selected === crop
                  ? { background: 'rgba(74,222,128,0.15)', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)' }
                  : { color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {crop}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(74,222,128,0.04)' }} />)}</div>
          ) : advisory ? (
            <div className="space-y-3">
              {[
                { icon: '💧', label: t('irrigation'), value: advisory.irrigation, color: '#38bdf8', bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.15)' },
                { icon: '🌱', label: t('fertilizer'), value: advisory.fertilizer, color: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.15)' },
                { icon: '🐛', label: t('pestControl'), value: advisory.pestControl, color: '#fbbf24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.15)' },
                { icon: '🌾', label: t('harvesting'), value: advisory.harvesting, color: '#a78bfa', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.15)' },
              ].map(({ icon, label, value, color, bg, border }) => (
                <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: bg, border: `1px solid ${border}` }}>
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{value}</p>
                  </div>
                </div>
              ))}

              {advisory.tips?.length > 0 && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
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
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}