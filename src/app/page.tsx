'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'
import { useEffect, useRef, useState } from 'react'
import { HERO_STATS, COPYRIGHT_YEAR } from '@/lib/config'

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = to / 60
      const timer = setInterval(() => {
        start = Math.min(start + step, to)
        setVal(Math.round(start))
        if (start >= to) clearInterval(timer)
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

function Grain() {
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.025, zIndex: 99 }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLang()

  const features = [
    { icon: '🔬', title: t('aiDiseaseScanner'), desc: 'Upload a photo — AI diagnoses disease in seconds with 95% accuracy using CNN + Vision models.', tag: 'CNN · Vision AI', delay: 0 },
    { icon: '🌦️', title: t('weatherForecast'), desc: 'Village-level forecasts using GPS coordinates, satellite imagery and real-time weather APIs.', tag: 'Satellite · GPS', delay: 80 },
    { icon: '💧', title: t('smartIrrigation'), desc: 'Soil moisture analysis recommends exact irrigation timing and water quantity per crop.', tag: 'IoT · AI Optimized', delay: 160 },
    { icon: '🌱', title: t('fertilizer'), desc: 'AI prescribes exact NPK quantities based on your crop type, soil, and local weather conditions.', tag: 'AI · ML', delay: 240 },
    { icon: '📈', title: t('mandiPrices'), desc: 'Live government Mandi prices with 7-day trends — know the best time to sell your harvest.', tag: 'Govt. Mandi API', delay: 320 },
    { icon: '🎙️', title: t('voiceAssistant'), desc: 'Speak in Hindi, Marathi, Punjabi, Tamil, Telugu, Kannada and more. Get answers instantly.', tag: '12+ Languages', delay: 400 },
  ]

  return (
    <main className="landing-root">
      <Grain />
      <div className="mesh-1" />
      <div className="mesh-2" />
      <div className="grid-bg-landing" />

      <Navbar />

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-pill">
            <span className="pill-dot" />
            <span>{t('tagline')}</span>
          </div>

          <h1 className="hero-h1">
            <span className="hero-h1-line1">{t('heroTitle').split(',')[0]},</span>
            <span className="hero-h1-line2">{t('heroTitle').split(',')[1]?.trim()}</span>
          </h1>

          <p className="hero-sub">{t('heroSub')}</p>

          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => router.push(session ? '/dashboard' : '/auth/signin')}>
              <span>{session ? t('goDashboard') : t('startFarming')}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="cta-secondary" onClick={() => router.push('/features')}>
              {t('seeHowItWorks')}
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-val">
                <Counter to={HERO_STATS.farmers.value} suffix={HERO_STATS.farmers.suffix} />
              </div>
              <div className="stat-label">{t('farmers')}</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-val">
                <Counter to={HERO_STATS.accuracy.value} suffix={HERO_STATS.accuracy.suffix} />
              </div>
              <div className="stat-label">{t('accuracy')}</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-val">
                <Counter to={HERO_STATS.languages.value} suffix={HERO_STATS.languages.suffix} />
              </div>
              <div className="stat-label">{t('languages')}</div>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="hero-visual">
          <div className="hv-card hv-card-1">
            <span className="hv-icon">🔬</span>
            <div>
              <div className="hv-label">AI Scan Result</div>
              <div className="hv-val" style={{ color: '#fbbf24' }}>Early Blight · 91%</div>
            </div>
          </div>
          <div className="hv-card hv-card-2">
            <span className="hv-icon">🌡️</span>
            <div>
              <div className="hv-label">Hyperlocal Weather · Live</div>
              <div className="hv-val" style={{ color: '#16a34a' }}>31°C · 78% Humidity</div>
            </div>
          </div>
          <div className="hv-card hv-card-3">
            <span className="hv-icon">🎙️</span>
            <div>
              <div className="hv-label">Voice Advisory</div>
              <div className="hv-val" style={{ color: '#a78bfa' }}>Hindi · English · +10</div>
            </div>
          </div>
          <div className="hv-card hv-card-4">
            <span className="hv-icon">📈</span>
            <div>
              <div className="hv-label">Tomato · Nashik Mandi</div>
              <div className="hv-val" style={{ color: '#4ade80' }}>₹2,840 / Quintal ↑8%</div>
            </div>
          </div>
          <div className="hv-center">🌿</div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-header">
          <p className="features-eyebrow">What we offer</p>
          <h2 className="features-h2">{t('everythingAFarmerNeeds')}</h2>
        </div>
        <div className="features-grid">
          {features.map(({ icon, title, desc, tag, delay }) => (
            <div key={title} className="feature-card" style={{ animationDelay: `${delay}ms` }}>
              <div className="feature-icon">{icon}</div>
              <div className="feature-tag">{tag}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
        <div className="features-cta">
          <button className="cta-secondary" onClick={() => router.push('/features')}>
            {t('seeFullFeatures')}
          </button>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="cta-band-inner">
          <div className="cta-band-glow" />
          <p className="cta-band-eyebrow">🇮🇳 Built for Bharat</p>
          <h2 className="cta-band-h2">{t('readyToTransform')}</h2>
          <p className="cta-band-sub">{t('joinFarmers')}</p>
          <button className="cta-primary cta-band-btn" onClick={() => router.push(session ? '/dashboard' : '/auth/signin')}>
            <span>{session ? t('goDashboard') : t('getStartedFree')}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="cta-band-fine">{t('freeNoCard')}</p>
        </div>
      </section>

      <footer className="landing-footer">
        © {COPYRIGHT_YEAR} AgroSense · Built for Bharat 🇮🇳 · <span style={{ color: 'rgba(30,30,20,0.3)' }}>Privacy · Terms</span>
      </footer>
    </main>
  )
}