'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'

export default function DiseaseScanner() {
  const { data: session } = useSession()
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
      } catch (e) {
        console.error('Error:', e)
        setResult({ disease: 'Error', summary: 'Analysis failed. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const severityColors: Record<string, string> = {
  Low: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  High: 'text-red-400 bg-red-400/10 border-red-400/20',
}

const severityColor =
  severityColors[result?.severity as string] ??
  'text-green-400 bg-green-400/10 border-green-400/20'
  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-green-100">AI Disease Scanner</h2>
          <p className="text-xs text-green-100/35 mt-0.5">Upload a crop photo for instant AI diagnosis</p>
        </div>
        <span className="text-[10px] px-2 py-1 bg-green-400/10 text-green-400 rounded-full border border-green-400/20">
          Groq AI
        </span>
      </div>

      <input
        type="text"
        placeholder="Crop name (optional, e.g. Wheat, Tomato)"
        value={cropName}
        onChange={e => setCropName(e.target.value)}
        className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 placeholder-green-100/30 outline-none focus:border-green-400/40 mb-3"
      />

      <div
        onClick={() => fileRef.current?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImage(f) }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-green-400/20 rounded-xl p-6 text-center cursor-pointer hover:border-green-400/40 transition-all mb-4"
      >
        {image ? (
          <img src={image} alt="crop" className="max-h-48 mx-auto rounded-lg object-cover" />
        ) : (
          <div>
            <div className="text-3xl mb-2">📸</div>
            <p className="text-xs text-green-100/50">Click or drag & drop a crop photo</p>
            <p className="text-[10px] text-green-100/25 mt-1">JPG, PNG supported</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f) }}
        />
      </div>

      {loading && (
        <div className="bg-green-400/5 border border-green-400/15 rounded-xl p-4 text-center">
          <div className="text-lg mb-2">🔬</div>
          <p className="text-xs text-green-100/60">Analyzing your crop with AI...</p>
          <div className="mt-3 h-1 bg-green-400/10 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-400/5 border border-green-400/15 rounded-xl">
            <div>
              <p className="text-xs text-green-100/40 mb-1">Detected</p>
              <p className="text-sm font-semibold text-green-100">{result.disease}</p>
              <p className="text-[10px] text-green-100/40 mt-1">{result.summary}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-300">{result.healthScore}</div>
              <div className="text-[10px] text-green-100/35">Health score</div>
              {result.severity && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border mt-1 inline-block ${severityColor}`}>
                  {result.severity}
                </span>
              )}
            </div>
          </div>

          {result.confidence > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-100/50">AI Confidence</span>
                <span className="text-green-300 font-semibold">{result.confidence}%</span>
              </div>
              <div className="h-1.5 bg-green-400/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
          )}

          {result.treatment?.length > 0 && (
            <div className="bg-green-400/5 border border-green-400/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-100 mb-3">Treatment Steps</p>
              <div className="space-y-2">
                {result.treatment.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-green-400/15 text-green-400 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-green-100/60">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.nutrients?.length > 0 && (
            <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-xl p-3">
              <p className="text-xs font-semibold text-yellow-300 mb-2">Nutrient Deficiencies</p>
              <div className="flex flex-wrap gap-2">
                {result.nutrients.map((n: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-1 bg-yellow-400/10 text-yellow-300 rounded-md">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { setImage(null); setResult(null) }}
            className="w-full py-2 text-xs text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/5 transition-all"
          >
            Scan another crop
          </button>
        </div>
      )}
    </div>
  )
}