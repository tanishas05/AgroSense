'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CropHealthCard() {
  const { data: session } = useSession()
  const [crops, setCrops] = useState<string[]>([])
  const [scans, setScans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!session?.user?.email) return

    async function load() {
      const [profileRes, scansRes] = await Promise.all([
        fetch(`/api/profile?email=${session!.user!.email}`),
        fetch(`/api/scans?email=${session!.user!.email}`),
      ])
      const profile = await profileRes.json()
      const scansData = await scansRes.json()

      setCrops(profile?.crops ?? ['Wheat', 'Tomato', 'Onion', 'Maize'])
      setScans(scansData)
      setLoading(false)
    }

    load()
  }, [session])

  // Build health data from real scans + crops
  function getHealthForCrop(crop: string) {
    const cropScans = scans.filter(s =>
      s.crop_name?.toLowerCase() === crop.toLowerCase()
    )
    if (cropScans.length > 0) {
      const latest = cropScans[0]
      return {
        health: latest.health_score ?? 80,
        status: latest.health_score >= 80 ? 'Healthy' : latest.health_score >= 60 ? 'Monitor' : 'At Risk',
        disease: latest.disease,
      }
    }
    // No scan — show as unscanned
    return { health: null, status: 'Not scanned', disease: null }
  }

  const fields = ['Field A', 'Field B', 'Field C', 'Field D']

  if (loading) return <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-64 animate-pulse" />

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">Crop Health</h2>
        <button
          onClick={() => router.push('/advisory')}
          className="text-[11px] text-green-400 hover:underline"
        >
          Scan new crop
        </button>
      </div>

      <div className="space-y-3">
        {crops.slice(0, 4).map((crop, i) => {
          const { health, status, disease } = getHealthForCrop(crop)
          const field = fields[i] ?? `Field ${i + 1}`

          return (
            <div key={crop}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-xs font-medium text-green-100">{crop}</span>
                  <span className="text-[10px] text-green-100/35 ml-2">{field}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    status === 'Healthy' ? 'bg-green-400/10 text-green-400' :
                    status === 'Monitor' ? 'bg-yellow-400/10 text-yellow-400' :
                    status === 'At Risk' ? 'bg-red-400/10 text-red-400' :
                    'bg-green-400/5 text-green-100/30'
                  }`}>
                    {status}
                  </span>
                  {health !== null && (
                    <span className="text-xs font-semibold text-green-300">{health}%</span>
                  )}
                </div>
              </div>
              {health !== null ? (
                <div className="h-1.5 bg-green-400/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      health >= 80 ? 'bg-green-400' :
                      health >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${health}%` }}
                  />
                </div>
              ) : (
                <div className="h-1.5 bg-green-400/5 rounded-full border border-dashed border-green-400/20" />
              )}
              {disease && disease !== 'Healthy' && (
                <p className="text-[10px] text-red-400/70 mt-0.5">{disease} detected</p>
              )}
            </div>
          )
        })}
      </div>

      {crops.length === 0 && (
        <p className="text-xs text-green-100/30 text-center py-4">
          Set your crops in Profile → Farm Settings
        </p>
      )}

      <button
        onClick={() => router.push('/advisory')}
        className="w-full mt-4 py-2.5 text-xs text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/5 transition-all"
      >
        + Upload crop photo for AI scan
      </button>
    </div>
  )
}