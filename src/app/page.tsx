'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'

export default function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLang()

  const features = [
    { icon: '🔬', title: t('aiDiseaseScanner'), desc: 'Upload a photo and get instant diagnosis with 95% accuracy.', tag: 'CNN · TensorFlow' },
    { icon: '🌦️', title: t('weatherForecast'), desc: 'Village-level forecasts using GPS, satellite data and weather APIs.', tag: 'Satellite · GPS' },
    { icon: '💧', title: t('smartIrrigation'), desc: 'Analyzes soil moisture to recommend optimal irrigation timing.', tag: 'IoT Sensors' },
    { icon: '🌱', title: t('fertilizer'), desc: 'AI recommends exact NPK quantities tailored to your crop and soil.', tag: 'AI · ML' },
    { icon: '📈', title: t('mandiPrices'), desc: 'Live Mandi prices and 7-day forecasts so you sell at the right time.', tag: 'Live Mandi APIs' },
    { icon: '🎙️', title: t('advisory'), desc: 'Speak in Hindi, Punjabi, Tamil, Marathi, Telugu, Kannada and more.', tag: '12+ Languages' },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)', top: -120, right: -120 }} />
      <Navbar />

      <section className="max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/25 text-xs text-green-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          {t('tagline')}
        </div>
        <h1 className="font-serif text-5xl lg:text-6xl text-green-50 mb-5 leading-tight tracking-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-base text-green-100/50 max-w-xl mx-auto mb-8 leading-relaxed">{t('heroSub')}</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => router.push(session ? '/dashboard' : '/auth/signin')} className="px-7 py-3.5 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-all">
            {session ? t('goDashboard') : t('startFarming')}
          </button>
          <button onClick={() => router.push('/features')} className="px-7 py-3.5 text-sm text-green-100/60 border border-green-100/15 rounded-lg hover:border-green-400/40 hover:text-green-300 transition-all">
            {t('seeHowItWorks')}
          </button>
        </div>
        <div className="flex items-center justify-center gap-12 mt-14 pt-10 border-t border-white/5">
          {[
            { value: '2.4M+', label: t('farmers') },
            { value: '95%', label: t('accuracy') },
            { value: '12', label: t('languages') },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-green-300 mb-1">{value}</div>
              <div className="text-xs text-green-100/35">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('everythingAFarmerNeeds')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, title, desc, tag }) => (
            <div key={title} className="bg-green-950/50 border border-green-400/10 rounded-2xl p-6 hover:border-green-400/25 hover:bg-green-950/80 transition-all">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-sm font-semibold text-green-100 mb-2">{title}</h3>
              <p className="text-xs text-green-100/40 leading-relaxed mb-4">{desc}</p>
              <span className="text-xs px-2 py-1 bg-green-400/8 border border-green-400/15 rounded text-green-400/70">{tag}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => router.push('/features')} className="text-sm text-green-400 border border-green-400/25 px-6 py-2.5 rounded-xl hover:bg-green-400/8 transition-all">
            {t('seeFullFeatures')}
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="bg-green-700/20 border border-green-400/20 rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('readyToTransform')}</h2>
          <p className="text-sm text-green-100/45 mb-8 max-w-md mx-auto">{t('joinFarmers')}</p>
          <button onClick={() => router.push(session ? '/dashboard' : '/auth/signin')} className="px-8 py-4 text-base font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all">
            {session ? t('goDashboard') : t('getStartedFree')}
          </button>
        </div>
      </section>

      <footer className="text-center text-xs pb-8 text-green-100/20">© 2026 AgroSense · Built for Bharat 🇮🇳</footer>
    </main>
  )
}