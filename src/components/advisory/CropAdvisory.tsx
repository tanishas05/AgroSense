'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CropAdvisory() {
  const { data: session } = useSession()
  const router = useRouter()
  const [crops, setCrops] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [advisory, setAdvisory] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Load user's crops from profile
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

  // Load weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&type=current`)
          .then(r => r.json())
          .then(setWeather)
      },
      () => {
        fetch('/api/weather?q=Delhi&type=current')
          .then(r => r.json())
          .then(setWeather)
      }
    )
  }, [])

  // Fetch advisory when crop or weather changes
  useEffect(() => {
    if (!weather || !selected) return
    setLoading(true)
    setAdvisory(null)
    fetch('/api/crop-advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: selected,
        weather: {
          temp: Math.round(weather.main?.temp ?? 28),
          humidity: weather.main?.humidity ?? 60,
          description: weather.weather?.[0]?.description ?? 'clear',
        },
      }),
    })
      .then(r => r.json())
      .then(data => { setAdvisory(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selected, weather])

  if (profileLoading) {
    return (
      <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-48 animate-pulse" />
    )
  }

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-green-100">Personalized Crop Advisory</h2>
          <p className="text-xs text-green-100/35 mt-0.5">AI advice based on your location & weather</p>
        </div>
        <span className="text-[10px] text-green-100/30">
          {crops.length} crops from your profile
        </span>
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-green-100/40 mb-4">No crops set in your profile yet</p>
          <button
            onClick={() => router.push('/profile')}
            className="text-xs text-green-400 border border-green-400/20 px-4 py-2 rounded-lg hover:bg-green-400/5 transition-all"
          >
            Set your crops in Profile →
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {crops.map(crop => (
              <button
                key={crop}
                onClick={() => setSelected(crop)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  selected === crop
                    ? 'bg-green-400/20 text-green-300 border border-green-400/30'
                    : 'text-green-100/40 border border-green-400/10 hover:text-green-300 hover:border-green-400/25'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-16 bg-green-400/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : advisory ? (
            <div className="space-y-3">
              {[
                { icon: '💧', label: 'Irrigation', value: advisory.irrigation },
                { icon: '🌱', label: 'Fertilizer', value: advisory.fertilizer },
                { icon: '🐛', label: 'Pest Control', value: advisory.pestControl },
                { icon: '🌾', label: 'Harvesting', value: advisory.harvesting },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-3 p-3 bg-green-400/5 border border-green-400/10 rounded-xl">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-green-100 mb-0.5">{label}</p>
                    <p className="text-xs text-green-100/50 leading-relaxed">{value}</p>
                  </div>
                </div>
              ))}

              {advisory.tips?.length > 0 && (
                <div className="bg-green-400/5 border border-green-400/10 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-100 mb-2">💡 Pro Tips</p>
                  <ul className="space-y-1.5">
                    {advisory.tips.map((tip: string, i: number) => (
                      <li key={i} className="text-xs text-green-100/50 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">→</span>
                        {tip}
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