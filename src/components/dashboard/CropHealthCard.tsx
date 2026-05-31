'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'

export default function CropHealthCard() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [crops, setCrops] = useState<string[]>([])
  const [scans, setScans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!session?.user?.email) return
    Promise.all([
      fetch(`/api/profile?email=${session.user.email}`).then(r => r.json()),
      fetch(`/api/scans?email=${session.user.email}`).then(r => r.json()),
    ]).then(([profile, scansData]) => {
      setCrops(profile?.crops ?? [])
      setScans(scansData)
      setLoading(false)
    })
  }, [session])

  function getHealth(crop: string) {
    const s = scans.find(s => s.crop_name?.toLowerCase() === crop.toLowerCase())
    if (s) return { score: s.health_score, status: s.health_score >= 80 ? t('healthy') : s.health_score >= 60 ? t('monitor') : t('atRisk') }
    return { score: null, status: t('notScanned') }
  }

  const statusStyle = (status: string) => {
    if (status === t('healthy')) return 'bg-green-400/10 text-green-400'
    if (status === t('monitor')) return 'bg-yellow-400/10 text-yellow-400'
    if (status === t('atRisk')) return 'bg-red-400/10 text-red-400'
    return 'bg-green-400/5 text-green-100/30'
  }

  const barColor = (score: number) => score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'

  if (loading) return <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-64 animate-pulse" />

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-green-100">{t('cropHealth')}</h2>
        <button onClick={() => router.push('/advisory')} className="text-xs text-green-400 hover:underline">{t('scanNewCrop')}</button>
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-xs text-green-100/30 mb-3">{t('noCropsSet')}</p>
          <button onClick={() => router.push('/profile')} className="text-xs text-green-400 border border-green-400/20 px-4 py-2 rounded-lg hover:bg-green-400/5 transition-all">
            {t('setCrops')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {crops.slice(0, 4).map((crop, i) => {
            const { score, status } = getHealth(crop)
            return (
              <div key={crop}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-medium text-green-100">{crop}</span>
                    <span className="text-xs text-green-100/35 ml-2">Field {i + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle(status)}`}>{status}</span>
                    {score !== null && <span className="text-xs font-semibold text-green-300">{score}%</span>}
                  </div>
                </div>
                <div className="h-1.5 bg-green-400/10 rounded-full overflow-hidden">
                  {score !== null
                    ? <div className={`h-full rounded-full ${barColor(score)}`} style={{ width: `${score}%` }} />
                    : <div className="h-full border border-dashed border-green-400/20 rounded-full" />
                  }
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button onClick={() => router.push('/advisory')} className="w-full mt-4 py-2.5 text-xs text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/5 transition-all">
        {t('uploadCropPhoto')}
      </button>
    </div>
  )
}