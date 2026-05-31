'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useLang } from '../../context/LanguageContext'

export default function DiseaseScanner() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [cropName, setCropName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImage(file: File) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setImage(dataUrl)
      setLoading(true)
      setResult(null)
      const base64 = dataUrl.split(',')[1]
      const mimeType = dataUrl.split(';')[0].split(':')[1]

      try {
        const res = await fetch('/api/analyze-crop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType, cropName }),
        })
        const data = await res.json()
        setResult(data)

        if (session?.user?.email && data.disease) {
          await fetch('/api/scans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              crop_name: cropName || 'Unknown',
              disease: data.disease,
              confidence: data.confidence,
              severity: data.severity,
              health_score: data.healthScore,
              treatment: data.treatment,
              nutrients: data.nutrients,
              summary: data.summary,
            }),
          })
        }
      } catch {
        setResult({ disease: 'Error', summary: 'Analysis failed. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const severityColor: Record<string, string> = {
    Low: '#4ade80', Medium: '#fbbf24', High: '#f87171', Unknown: 'rgba(255,255,255,0.3)',
  }

  return (
    <div className="p-5 rounded-xl" style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.15)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{t('aiDiseaseScanner')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.6)' }}>{t('uploadPhotoDesc')}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
          Groq AI
        </span>
      </div>

      <input
        type="text"
        placeholder={t('cropNameOptional')}
        value={cropName}
        onChange={e => setCropName(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-lg mb-3 outline-none"
        style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', color: '#e8f5e2' }}
      />

      <div
        onClick={() => fileRef.current?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImage(f) }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer mb-4 transition-all"
        style={{ borderColor: 'rgba(167,139,250,0.25)' }}
      >
        {image ? (
          <img src={image} alt="crop" className="max-h-48 mx-auto rounded-lg object-cover" />
        ) : (
          <div>
            <div className="text-3xl mb-2">📸</div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('clickOrDrop')}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>{t('jpgPng')}</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f) }} />
      </div>

      {loading && (
        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}>
          <div className="text-lg mb-2">🔬</div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('analyzing')}</p>
          <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.1)' }}>
            <div className="h-full rounded-full animate-pulse" style={{ width: '66%', background: '#a78bfa' }} />
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)' }}>
            <div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('detected')}</p>
              <p className="text-sm font-semibold text-white">{result.disease}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{result.summary}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{result.healthScore}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('healthScore')}</div>
              {result.severity && (
                <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ color: severityColor[result.severity] ?? '#fff', background: `${severityColor[result.severity]}15`, border: `1px solid ${severityColor[result.severity]}30` }}>
                  {result.severity}
                </span>
              )}
            </div>
          </div>

          {result.confidence > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{t('aiConfidence')}</span>
                <span className="font-semibold" style={{ color: '#a78bfa' }}>{result.confidence}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${result.confidence}%`, background: '#a78bfa' }} />
              </div>
            </div>
          )}

          {result.treatment?.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <p className="text-xs font-semibold text-white mb-3">{t('treatmentSteps')}</p>
              <div className="space-y-2">
                {result.treatment.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>{i + 1}</span>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.nutrients?.length > 0 && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#fbbf24' }}>{t('nutrientDeficiencies')}</p>
              <div className="flex flex-wrap gap-2">
                {result.nutrients.map((n: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>{n}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setImage(null); setResult(null) }} className="w-full py-2 text-xs rounded-lg transition-all" style={{ color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
            {t('scanAnother')}
          </button>
        </div>
      )}
    </div>
  )
}