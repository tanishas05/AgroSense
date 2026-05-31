'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'

const features = [
  { icon: '🔬', title: 'aiDiseaseScanner', desc: 'Upload a photo and get instant diagnosis with 95% accuracy.', tag: 'CNN · TensorFlow', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  { icon: '🌦️', title: 'weatherForecast', desc: 'Village-level forecasts using GPS, satellite data and weather APIs.', tag: 'Satellite · GPS', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)' },
  { icon: '💧', title: 'smartIrrigation', desc: 'Analyzes soil moisture and crop type to recommend optimal irrigation.', tag: 'IoT Sensors', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)' },
  { icon: '🌱', title: 'fertilizer', desc: 'AI recommends exact NPK quantities tailored to your crop and soil.', tag: 'AI · ML', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  { icon: '📈', title: 'mandiPrices', desc: 'Live Mandi prices and 7-day forecasts so you sell at the right time.', tag: 'Live Mandi APIs', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  { icon: '🎙️', title: 'aiAdvisory', desc: 'Speak in Hindi, Punjabi, Tamil, Marathi, Telugu, Kannada and more.', tag: '12+ Languages', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
]

const featureTitles: Record<string, string> = {
  aiDiseaseScanner: 'AI Disease Detection',
  weatherForecast: 'Hyperlocal Weather',
  smartIrrigation: 'Smart Irrigation',
  fertilizer: 'Fertilizer Optimizer',
  mandiPrices: 'Market Prices',
  aiAdvisory: 'Voice Assistant',
}

export default function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useTranslation()

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', top: -200, right: -100 }} />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)', bottom: 100, left: -100 }} />

      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
          style={{ backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          {t('tagline')}
        </div>

        <h1 className="font-serif mb-6 text-green-50" style={{ fontSize: '4rem', lineHeight: 1.1 }}>
          Farm <span style={{ color: '#4ade80', fontStyle: 'italic' }}>smarter</span>,<br />
          harvest <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>better.</span>
        </h1>

        <p className="text-lg text-green-100/50 max-w-xl mx-auto mb-10 leading-relaxed">
          {t('heroSub')}
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push(session ? '/dashboard' : '/auth/signin')}
            className="px-8 py-3.5 text-base font-medium text-white rounded-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #16a34a, #0ea5e9)' }}
          >
            {session ? t('dashboard') : t('getStartedFree')}
          </button>
          <button
            onClick={() => router.push('/features')}
            className="px-8 py-3.5 text-base rounded-xl transition-all"
            style={{ color: 'rgba(232,245,226,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {t('seeHowItWorks')}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-16 mt-16 pt-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { value: '2.4M+', label: t('farmers'), color: '#4ade80' },
            { value: '95%', label: t('accuracy'), color: '#fbbf24' },
            { value: '12', label: t('languages'), color: '#a78bfa' },
          ].map(({ value, label, color }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
              <div className="text-sm text-green-100/35">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('everythingAFarmerNeeds')}</h2>
          <p className="text-base text-green-100/40">Six intelligent modules working together</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, title, desc, tag, color, bg, border }) => (
            <div key={title} className="p-6 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-base font-semibold mb-2" style={{ color }}>{featureTitles[title]}</h3>
              <p className="text-sm text-green-100/45 leading-relaxed mb-4">{desc}</p>
              <span className="text-xs px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
                {tag}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => router.push('/features')}
            className="text-sm border px-6 py-2.5 rounded-xl transition-all"
            style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.25)' }}>
            See full feature details →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="rounded-3xl p-14 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(56,189,248,0.08))', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('readyToTransform')}</h2>
          <p className="text-base text-green-100/40 mb-8">{t('joinFarmers')}</p>
          <button
            onClick={() => router.push(session ? '/dashboard' : '/auth/signin')}
            className="px-8 py-3.5 text-base font-medium text-white rounded-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #16a34a, #0ea5e9)' }}
          >
            {session ? t('dashboard') : t('getStartedFree')}
          </button>
        </div>
      </section>

      <footer className="text-center text-sm pb-8" style={{ color: 'rgba(255,255,255,0.15)' }}>
        © 2026 AgroSense · Built for Bharat 🇮🇳
      </footer>
    </main>
  )
}