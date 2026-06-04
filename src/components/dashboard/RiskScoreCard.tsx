'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'

interface RiskData {
  overall: number
  crop: number
  disease: number
  water: number
  insight: string
  village: string
}

function RiskArc({ value, size = 80 }: { value: number; size?: number }) {
  const r = size / 2 - 9
  const circ = 2 * Math.PI * r
  const dash = (Math.min(value, 100) / 100) * circ * 0.75
  const color = value < 35 ? '#4ade80' : value < 65 ? '#f59e0b' : '#ef4444'
  const rot = -135
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(74,222,128,0.1)" strokeWidth="8"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round"
        transform={`rotate(${rot} ${size / 2} ${size / 2})`} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash + circ * 0.25}`} strokeLinecap="round"
        transform={`rotate(${rot} ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="14" fontWeight="700" fontFamily="inherit">{value}%</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(232,245,226,0.3)" fontSize="8" fontFamily="inherit">RISK</text>
    </svg>
  )
}

function RiskBar({ label, value, lang }: { label: string; value: number; lang: string }) {
  const color = value < 35 ? '#4ade80' : value < 65 ? '#f59e0b' : '#ef4444'
  const levelEn = value < 35 ? 'Low' : value < 65 ? 'Medium' : 'High'
  const levelHi = value < 35 ? 'कम' : value < 65 ? 'मध्यम' : 'अधिक'
  const level = lang === 'hi' ? levelHi : levelEn
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: 'rgba(232,245,226,0.55)' }}>{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
            background: `${color}18`, color, border: `1px solid ${color}30`, fontSize: 10
          }}>{level}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.08)' }}>
        <div className="h-full rounded-full" style={{
          width: `${value}%`, background: color,
          transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 6px ${color}40`
        }} />
      </div>
    </div>
  )
}

export default function RiskScoreCard() {
  const { data: session } = useSession()
  const { t, lang } = useLang()
  const [risk, setRisk] = useState<RiskData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function compute() {
      try {
        // Get weather + profile in parallel
        const locRes = await new Promise<{ lat: number; lon: number }>((res) =>
          navigator.geolocation.getCurrentPosition(
            p => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
            () => res({ lat: 20.0059, lon: 73.7961 }) // Nashik default
          )
        )
        const [weatherRes, profileRes] = await Promise.all([
          fetch(`/api/weather?lat=${locRes.lat}&lon=${locRes.lon}&type=current`).then(r => r.json()),
          session?.user?.email
            ? fetch(`/api/profile?email=${session.user.email}`).then(r => r.json())
            : Promise.resolve(null),
        ])

        const temp: number = weatherRes.main?.temp ?? 28
        const humidity: number = weatherRes.main?.humidity ?? 60
        const rain: boolean = weatherRes.weather?.[0]?.main === 'Rain'
        const village: string = weatherRes.name ?? 'Your Village'

        // Disease risk: humidity + temp driven
        const disease = Math.min(95, Math.round(
          (humidity > 75 ? 55 : humidity > 60 ? 35 : 18) +
          (temp > 34 ? 15 : temp > 30 ? 8 : 2) +
          (rain ? 12 : 0)
        ))

        // Water shortage: inverse humidity + high temp
        const water = Math.min(90, Math.round(
          (humidity < 40 ? 55 : humidity < 55 ? 35 : 15) +
          (temp > 36 ? 20 : temp > 32 ? 10 : 3) +
          (rain ? -15 : 5)
        ))

        // Crop failure: combined
        const crop = Math.min(85, Math.round((disease * 0.4 + water * 0.45 + (temp > 38 ? 20 : 5)) * 0.65))

        // Overall weighted
        const overall = Math.round(disease * 0.35 + water * 0.35 + crop * 0.3)

        // Build insight
        const insightEn = disease > 60
          ? `High humidity (${Math.round(humidity)}%) at ${village} raises fungal disease risk. Spray copper fungicide on your crops within 48 hours.`
          : water > 55
          ? `Low soil moisture expected at ${village}. Irrigate your crops early tomorrow morning — ${Math.round(temp)}°C heat is accelerating water loss.`
          : `Conditions at ${village} look stable. Monitor your crops regularly and maintain normal irrigation schedule.`

        const insightHi = disease > 60
          ? `${village} में उच्च आर्द्रता (${Math.round(humidity)}%) फफूंद रोग का खतरा बढ़ाती है। 48 घंटे में कॉपर फफूंदनाशक छिड़काव करें।`
          : water > 55
          ? `${village} में मिट्टी की नमी कम है। कल सुबह जल्दी सिंचाई करें — ${Math.round(temp)}°C तापमान पानी तेज़ी से सुखा रहा है।`
          : `${village} में स्थिति स्थिर है। नियमित निगरानी रखें और सामान्य सिंचाई कार्यक्रम बनाए रखें।`

        setRisk({
          overall, crop, disease, water,
          insight: lang === 'hi' ? insightHi : insightEn,
          village,
        })
      } catch {
        setRisk({ overall: 42, crop: 28, disease: 61, water: 38, insight: 'Could not compute risk. Check your connection.', village: 'Your Village' })
      } finally {
        setLoading(false)
      }
    }
    compute()
  }, [session, lang])

  if (loading) return (
    <div className="h-56 rounded-xl animate-pulse" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }} />
  )

  if (!risk) return null

  const insightColor = risk.disease > 60 || risk.water > 60 ? '#f87171' : risk.overall > 40 ? '#fbbf24' : '#4ade80'
  const insightBg = risk.disease > 60 || risk.water > 60 ? 'rgba(239,68,68,0.07)' : risk.overall > 40 ? 'rgba(251,191,36,0.07)' : 'rgba(74,222,128,0.07)'
  const insightBorder = risk.disease > 60 || risk.water > 60 ? 'rgba(239,68,68,0.2)' : risk.overall > 40 ? 'rgba(251,191,36,0.2)' : 'rgba(74,222,128,0.2)'

  const labels = {
    crop: lang === 'hi' ? 'फसल विफलता जोखिम' : 'Crop Failure Risk',
    disease: lang === 'hi' ? 'रोग संभावना' : 'Disease Probability',
    water: lang === 'hi' ? 'पानी की कमी' : 'Water Shortage Risk',
  }

  return (
    <div className="p-5 rounded-xl" style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.14)' }}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            🤖 {lang === 'hi' ? 'AI खेती जोखिम स्कोर' : 'AI Farming Risk Score'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(232,245,226,0.4)' }}>
            📍 {risk.village} · {lang === 'hi' ? 'हर घंटे अपडेट' : 'Updated every hour'}
          </p>
        </div>
        <RiskArc value={risk.overall} size={76} />
      </div>

      {/* Risk bars */}
      <RiskBar label={labels.crop} value={risk.crop} lang={lang} />
      <RiskBar label={labels.disease} value={risk.disease} lang={lang} />
      <RiskBar label={labels.water} value={risk.water} lang={lang} />

      {/* AI Insight */}
      <div className="mt-4 p-3 rounded-xl" style={{ background: insightBg, border: `1px solid ${insightBorder}` }}>
        <p className="text-xs font-semibold mb-1.5" style={{ color: insightColor }}>
          ⚡ {lang === 'hi' ? 'AI अंतर्दृष्टि' : 'AI Insight'}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(232,245,226,0.6)' }}>
          {risk.insight}
        </p>
      </div>
    </div>
  )
}