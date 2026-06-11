'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'

export default function DiseaseScanner() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [cropName, setCropName] = useState('')
  const [dragOver, setDragOver] = useState(false)
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
            body: JSON.stringify({ email: session.user.email, crop_name: cropName || 'Unknown', disease: data.disease, confidence: data.confidence, severity: data.severity, health_score: data.healthScore, treatment: data.treatment, nutrients: data.nutrients, summary: data.summary }),
          })
        }
      } catch {
        setResult({ disease: 'Error', summary: 'Analysis failed. Please try again.' })
      } finally { setLoading(false) }
    }
    reader.readAsDataURL(file)
  }

  const severityColor: Record<string, string> = { Low: '#4ade80', Medium: '#fbbf24', High: '#f87171', Unknown: 'rgba(255,255,255,0.3)' }

  return (
    <div className="p-5 rounded-2xl h-full" style={{ background: 'white', border: '1px solid rgba(167,139,250,0.15)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "#1a1a14" }}>🔬 {t('aiDiseaseScanner')}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.6)' }}>{t('uploadPhotoDesc')}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>Groq AI</span>
      </div>

      {!result && !loading && (
        <>
          <input type="text" placeholder={t('cropNameOptional')} value={cropName}
            onChange={e => setCropName(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl mb-3 outline-none"
            style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', color: '#1a1a1a' }} />

          <div onClick={() => fileRef.current?.click()}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImage(f) }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className="rounded-2xl p-8 text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragOver ? 'rgba(167,139,250,0.6)' : 'rgba(167,139,250,0.2)'}`,
              background: dragOver ? 'rgba(167,139,250,0.08)' : 'rgba(167,139,250,0.03)',
            }}>
            {image ? (
              <img src={image} alt="crop" className="max-h-48 mx-auto rounded-xl object-cover" />
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>📸</div>
                <p className="text-sm font-medium mb-1" style={{ color: '#3a3a2a' }}>{t('clickOrDrop')}</p>
                <p className="text-xs" style={{ color: '#9a9a8a' }}>{t('jpgPng')}</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f) }} />
          </div>
        </>
      )}

      {loading && (
        <div className="py-10 text-center">
          <div className="text-4xl mb-4">🔬</div>
          <p className="text-sm font-medium mb-1" style={{ color: "#1a1a14" }}>{t('analyzing')}</p>
          <p className="text-xs mb-4" style={{ color: '#8a8a7a' }}>Running Groq Llama 4 Scout Vision...</p>
          <div className="h-1.5 rounded-full overflow-hidden mx-auto max-w-48" style={{ background: 'rgba(167,139,250,0.1)' }}>
            <div className="h-full rounded-full animate-pulse" style={{ width: '70%', background: '#a78bfa' }} />
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3">
          {/* Result hero */}
          <div className="flex items-start justify-between p-4 rounded-2xl"
            style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)' }}>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>{t('detected')}</p>
              <p className="text-base font-bold mb-1" style={{ color: "#1a1a14" }} >{result.disease}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6a6a5a' }}>{result.summary}</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <div className="text-3xl font-bold" style={{ color: '#a78bfa' }}>{result.healthScore}</div>
              <div className="text-xs mt-0.5" style={{ color: '#8a8a7a' }}>{t('healthScore')}</div>
              {result.severity && (
                <span className="text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block"
                  style={{ color: severityColor[result.severity], background: `${severityColor[result.severity]}15`, border: `1px solid ${severityColor[result.severity]}30` }}>
                  {result.severity}
                </span>
              )}
            </div>
          </div>

          {result.confidence > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: '#6a6a5a' }}>{t('aiConfidence')}</span>
                <span className="font-semibold" style={{ color: '#a78bfa' }}>{result.confidence}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.1)' }}>
                <div className="h-full rounded-full" style={{ width: `${result.confidence}%`, background: '#a78bfa' }} />
              </div>
            </div>
          )}

          {result.treatment?.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "#1a1a14" }} >{t('treatmentSteps')}</p>
              <div className="space-y-2">
                {result.treatment.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold"
                      style={{ background: 'rgba(74,222,128,0.15)', color: '#16a34a' }}>{i+1}</span>
                    <p className="text-xs leading-relaxed" style={{ color: '#4a4a3a' }}>{step}</p>
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
                  <span key={i} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>{n}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setImage(null); setResult(null) }}
            className="w-full py-2.5 text-xs rounded-xl transition-all"
            style={{ color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(167,139,250,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {t('scanAnother')}
          </button>
        </div>
      )}
    </div>
  )
}