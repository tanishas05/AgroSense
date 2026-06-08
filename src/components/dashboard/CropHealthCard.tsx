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

  const statusConfig: Record<string, { bg: string; color: string }> = {
    [t('healthy')]:    { bg: 'rgba(74,222,128,0.1)',  color: '#16a34a' },
    [t('monitor')]:    { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24' },
    [t('atRisk')]:     { bg: 'rgba(239,68,68,0.1)',   color: '#f87171' },
    [t('notScanned')]: { bg: 'rgba(255,255,255,0.05)', color: '#8a8a7a' },
  }

  const barColor = (score: number) => score >= 80 ? '#4ade80' : score >= 60 ? '#fbbf24' : '#f87171'

  if (loading) return (
    <div className="h-64 rounded-2xl animate-pulse" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} />
  )

  return (
    <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#1a1a14]">🌾 {t('cropHealth')}</h2>
        <button onClick={() => router.push('/advisory')}
          className="text-xs px-2.5 py-1 rounded-lg transition-all"
          style={{ color: '#16a34a', border: '1px solid rgba(74,222,128,0.2)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(74,222,128,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          {t('scanNewCrop')}
        </button>
      </div>

      {crops.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-3">🌱</div>
          <p className="text-xs mb-4" style={{ color: '#8a8a7a' }}>{t('noCropsSet')}</p>
          <button onClick={() => router.push('/profile')}
            className="text-xs px-4 py-2 rounded-lg"
            style={{ color: '#16a34a', border: '1px solid rgba(74,222,128,0.2)' }}>
            {t('setCrops')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {crops.slice(0, 4).map((crop, i) => {
            const { score, status } = getHealth(crop)
            const cfg = statusConfig[status] ?? statusConfig[t('notScanned')]
            return (
              <div key={crop} className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-[#1a1a14]">{crop}</span>
                    <span className="text-xs ml-2" style={{ color: '#9a9a8a' }}>Field {i + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>{status}</span>
                    {score !== null && <span className="text-xs font-bold" style={{ color: barColor(score) }}>{score}%</span>}
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.08)' }}>
                  {score !== null
                    ? <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${score}%`, background: barColor(score) }} />
                    : <div className="h-full rounded-full" style={{ background: 'rgba(0,0,0,0.04)' }} />
                  }
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button onClick={() => router.push('/advisory')}
        className="w-full mt-4 py-2.5 text-xs rounded-xl transition-all"
        style={{ color: '#16a34a', border: '1px solid rgba(74,222,128,0.15)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
        {t('uploadCropPhoto')}
      </button>
    </div>
  )
}