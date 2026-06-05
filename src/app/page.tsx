'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'
import { useEffect, useRef, useState } from 'react'

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

  // Only features that actually exist in the codebase
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
              <div className="stat-val"><Counter to={24} suffix="L+" /></div>
              <div className="stat-label">{t('farmers')}</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-val"><Counter to={95} suffix="%" /></div>
              <div className="stat-label">{t('accuracy')}</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-val"><Counter to={12} suffix="+" /></div>
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
              <div className="hv-val" style={{ color: '#86efac' }}>31°C · 78% Humidity</div>
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
        © 2026 AgroSense · Built for Bharat 🇮🇳 · <span style={{ color: 'rgba(232,245,226,0.2)' }}>Privacy · Terms</span>
      </footer>

      <style>{`
        .landing-root { position: relative; min-height: 100vh; overflow-x: hidden; background: #080f09; color: #e8f5e2; }
        .mesh-1 { position: fixed; top: -200px; right: -200px; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .mesh-2 { position: fixed; bottom: -300px; left: -200px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .grid-bg-landing { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px); background-size: 56px 56px; }

        .hero-section { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; min-height: 85vh; }
        .hero-inner { display: flex; flex-direction: column; }

        .hero-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; font-size: 12px; font-weight: 500; width: fit-content; margin-bottom: 28px; animation: fadeUp 0.6s ease both; }
        .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: pulse-dot 2s ease-in-out infinite; }

        .hero-h1 { font-family: 'DM Serif Display', serif; font-size: clamp(42px, 5vw, 68px); line-height: 1.05; color: #f0fdf4; letter-spacing: -0.02em; margin-bottom: 24px; }
        .hero-h1-line1 { display: block; animation: fadeUp 0.6s 0.1s ease both; }
        .hero-h1-line2 { display: block; color: #4ade80; animation: fadeUp 0.6s 0.2s ease both; }

        .hero-sub { font-size: 15px; line-height: 1.7; color: rgba(232,245,226,0.45); max-width: 460px; margin-bottom: 36px; animation: fadeUp 0.6s 0.3s ease both; }

        .hero-ctas { display: flex; gap: 12px; margin-bottom: 48px; animation: fadeUp 0.6s 0.4s ease both; }
        .cta-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 12px; background: #16a34a; color: white; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }
        .cta-primary:hover { background: #15803d; box-shadow: 0 0 24px rgba(74,222,128,0.25); transform: translateY(-1px); }
        .cta-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 12px; background: transparent; color: rgba(232,245,226,0.55); font-size: 14px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s; }
        .cta-secondary:hover { border-color: rgba(74,222,128,0.35); color: #86efac; }

        .hero-stats { display: flex; align-items: center; gap: 32px; padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.06); animation: fadeUp 0.6s 0.5s ease both; }
        .stat-val { font-size: 28px; font-weight: 700; color: #86efac; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 11px; color: rgba(232,245,226,0.3); text-transform: uppercase; letter-spacing: 0.08em; }
        .stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }

        .hero-visual { position: relative; height: 480px; animation: fadeUp 0.8s 0.3s ease both; }
        .hv-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 80px; filter: drop-shadow(0 0 40px rgba(74,222,128,0.3)); animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-12px)} }

        .hv-card { position: absolute; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; background: rgba(14,26,16,0.92); border: 1px solid rgba(74,222,128,0.18); backdrop-filter: blur(12px); white-space: nowrap; animation: hv-float var(--dur,5s) var(--del,0s) ease-in-out infinite; }
        .hv-icon { font-size: 20px; flex-shrink: 0; }
        .hv-label { font-size: 10px; color: rgba(232,245,226,0.35); margin-bottom: 2px; }
        .hv-val { font-size: 13px; font-weight: 600; }
        .hv-card-1 { top: 5%; left: 0; --dur:5s; --del:0s; }
        .hv-card-2 { top: 30%; right: 0; --dur:6s; --del:0.8s; }
        .hv-card-3 { bottom: 30%; left: 5%; --dur:4.5s; --del:0.4s; }
        .hv-card-4 { bottom: 5%; right: 5%; --dur:5.5s; --del:1.2s; }
        @keyframes hv-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .features-section { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 40px 48px 80px; }
        .features-header { text-align: center; margin-bottom: 48px; }
        .features-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #4ade80; margin-bottom: 12px; }
        .features-h2 { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 4vw, 48px); color: #f0fdf4; line-height: 1.1; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .feature-card { position: relative; overflow: hidden; padding: 24px; border-radius: 16px; background: rgba(12,24,14,0.8); border: 1px solid rgba(74,222,128,0.08); transition: all 0.25s; animation: fadeUp 0.5s ease both; }
        .feature-card::before { content: ''; position: absolute; inset: 0; border-radius: 16px; background: radial-gradient(circle at 0% 0%, rgba(74,222,128,0.06) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
        .feature-card:hover { border-color: rgba(74,222,128,0.22); transform: translateY(-2px); }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon { font-size: 28px; margin-bottom: 16px; }
        .feature-tag { display: inline-block; font-size: 10px; padding: 3px 8px; border-radius: 6px; background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.14); color: rgba(74,222,128,0.7); margin-bottom: 12px; }
        .feature-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 600; color: #e8f5e2; margin-bottom: 8px; line-height: 1.3; }
        .feature-desc { font-size: 12px; line-height: 1.65; color: rgba(232,245,226,0.38); }
        .features-cta { text-align: center; margin-top: 36px; }

        .cta-band { position: relative; z-index: 1; padding: 0 48px 80px; max-width: 1200px; margin: 0 auto; }
        .cta-band-inner { position: relative; overflow: hidden; padding: 72px 48px; border-radius: 24px; background: rgba(16,36,20,0.9); border: 1px solid rgba(74,222,128,0.15); text-align: center; }
        .cta-band-glow { position: absolute; top: -150px; left: 50%; transform: translateX(-50%); width: 500px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 65%); pointer-events: none; }
        .cta-band-eyebrow { font-size: 12px; color: rgba(74,222,128,0.6); margin-bottom: 16px; }
        .cta-band-h2 { font-family: 'DM Serif Display', serif; font-size: clamp(28px, 4vw, 44px); color: #f0fdf4; margin-bottom: 12px; line-height: 1.1; }
        .cta-band-sub { font-size: 14px; color: rgba(232,245,226,0.4); margin-bottom: 36px; }
        .cta-band-btn { padding: 16px 36px; font-size: 15px; }
        .cta-band-fine { margin-top: 16px; font-size: 11px; color: rgba(232,245,226,0.2); }

        .landing-footer { text-align: center; padding: 24px; font-size: 12px; color: rgba(232,245,226,0.2); position: relative; z-index: 1; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width: 900px) {
          .hero-section { grid-template-columns: 1fr; padding: 48px 24px; min-height: auto; gap: 48px; }
          .hero-visual { height: 320px; }
          .features-section { padding: 32px 24px 64px; }
          .features-grid { grid-template-columns: 1fr 1fr; }
          .cta-band { padding: 0 24px 64px; }
          .cta-band-inner { padding: 48px 24px; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 20px; }
          .stat-val { font-size: 22px; }
        }
      `}</style>
    </main>
  )
}