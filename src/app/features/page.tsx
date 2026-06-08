'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'

const features = [
  { number: '01', icon: '🔬', accent: '#a78bfa', accentBg: 'rgba(167,139,250,0.08)', accentBorder: 'rgba(167,139,250,0.2)', titleKey: 'aiDiseaseScanner', desc: { en: 'Upload a crop photo and get instant AI diagnosis with 95% accuracy. Identifies 50+ diseases and suggests treatments.', hi: 'फसल की फोटो से 95% सटीकता के साथ तत्काल AI निदान। 50+ रोग पहचानता है।' }, points: { en: ['Detects 50+ crop diseases', 'Nutrient deficiency detection', 'Treatment step recommendations', 'Works offline'], hi: ['50+ फसल रोग पहचानता है', 'पोषक तत्वों की कमी पहचानता है', 'उपचार चरण सुझाता है', 'ऑफलाइन काम करता है'] }, tech: ['CNN / Vision AI', 'TensorFlow', 'PyTorch'], href: '/advisory', btnKey: 'tryScanner', visual: { stat: '95%', statLabel: 'AI Accuracy', detail: 'Early Blight detected', sub: 'Confidence: 91% · Treatment ready' } },
  { number: '02', icon: '🌦️', accent: '#38bdf8', accentBg: 'rgba(56,189,248,0.08)', accentBorder: 'rgba(56,189,248,0.2)', titleKey: 'weatherForecast', desc: { en: 'Village-level weather forecasts with 1km GPS accuracy. Alerts for rainfall, frost, heatwaves and optimal sowing.', hi: '1km GPS सटीकता के साथ गाँव-स्तरीय मौसम पूर्वानुमान।' }, points: { en: ['1km hyperlocal forecasts', 'Heatwave & frost warnings', 'Optimal sowing windows', '7-day rain probability'], hi: ['1km सटीकता का पूर्वानुमान', 'गर्मी और पाले की चेतावनी', 'बुवाई के लिए सर्वोत्तम समय', '7-दिन वर्षा पूर्वानुमान'] }, tech: ['OpenWeather API', 'Satellite Data', 'GPS'], href: '/dashboard', btnKey: 'goToDashboard', visual: { stat: '32°C', statLabel: 'Ozar Village · Live', detail: '78% Humidity · Overcast', sub: '65% rain chance tomorrow' } },
  { number: '03', icon: '💧', accent: '#4ade80', accentBg: 'rgba(74,222,128,0.08)', accentBorder: 'rgba(74,222,128,0.2)', titleKey: 'smartIrrigation', desc: { en: 'AI recommends exact water amount and optimal irrigation timing based on soil moisture and weather. Saves up to 40% water.', hi: 'AI मिट्टी और मौसम के आधार पर सटीक सिंचाई समय बताता है। 40% पानी बचाता है।' }, points: { en: ['Real-time soil moisture', 'Optimal irrigation timing', 'Prevents over-irrigation', 'Reduces electricity costs'], hi: ['रियल-टाइम मिट्टी नमी', 'सर्वोत्तम सिंचाई समय', 'अधिक सिंचाई रोकता है', 'बिजली लागत कम करता है'] }, tech: ['IoT Sensors', 'ML Models', 'Soil Analysis'], href: '/dashboard', btnKey: 'goToDashboard', visual: { stat: '62%', statLabel: 'Soil Moisture', detail: 'Next: Tomorrow 6AM', sub: '25mm · 45 min recommended' } },
  { number: '04', icon: '🌱', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', accentBorder: 'rgba(52,211,153,0.2)', titleKey: 'fertilizer', desc: { en: 'Precise NPK recommendations based on crop type, soil health and growth stage. Reduces fertilizer costs by 25%.', hi: 'फसल प्रकार और मिट्टी स्वास्थ्य के आधार पर सटीक NPK सिफारिशें।' }, points: { en: ['Exact NPK quantities', 'Organic matter scheduling', '25% cost reduction', 'Soil health improvement'], hi: ['सटीक NPK मात्रा', 'जैविक पदार्थ शेड्यूलिंग', '25% लागत कम', 'मिट्टी स्वास्थ्य सुधार'] }, tech: ['Soil Analysis', 'AI Models', 'Crop Database'], href: '/advisory', btnKey: 'tryScanner', visual: { stat: '25%', statLabel: 'Cost Saved', detail: 'Wheat · NPK: 120-60-40', sub: 'Apply Urea 50kg/acre now' } },
  { number: '05', icon: '📈', accent: '#fbbf24', accentBg: 'rgba(251,191,36,0.08)', accentBorder: 'rgba(251,191,36,0.2)', titleKey: 'mandiPrices', desc: { en: 'Live Mandi prices from 3000+ markets across India with AI-powered 7-day price predictions.', hi: '3000+ मंडियों से लाइव भाव और AI-संचालित 7-दिवसीय पूर्वानुमान।' }, points: { en: ['3000+ live Mandi prices', '7-day AI price forecasts', 'Best market recommendations', 'Historical trend analysis'], hi: ['3000+ मंडियों से लाइव भाव', 'AI मूल्य पूर्वानुमान', 'सर्वोत्तम बाज़ार सिफारिश', 'ऐतिहासिक विश्लेषण'] }, tech: ['Govt Mandi APIs', 'ML Forecasting', 'Price Models'], href: '/market', btnKey: 'market', visual: { stat: '₹2,840', statLabel: 'Tomato · Nashik APMC', detail: '↑ 8.2% this week', sub: 'Best time to sell: 3 days' } },
  { number: '06', icon: '🎙️', accent: '#f472b6', accentBg: 'rgba(244,114,182,0.08)', accentBorder: 'rgba(244,114,182,0.2)', titleKey: 'advisory', desc: { en: 'Voice-based farming advice in 12+ Indian languages. Works offline in rural areas with SMS fallback.', hi: '12+ भारतीय भाषाओं में आवाज़ सलाह। SMS बैकअप के साथ ऑफलाइन काम करता है।' }, points: { en: ['12+ Indian languages', 'Voice commands & responses', 'Offline in rural areas', 'SMS fallback system'], hi: ['12+ भारतीय भाषाएं', 'आवाज़ कमांड और उत्तर', 'ऑफलाइन काम', 'SMS बैकअप'] }, tech: ['NLP Transformers', 'Speech API', 'Translation'], href: '/advisory', btnKey: 'tryScanner', visual: { stat: '12+', statLabel: 'Languages', detail: 'Hindi · Marathi · Punjabi', sub: 'Tamil · Telugu · Kannada +6' } },
]

const steps = {
  en: [
    { number: '01', icon: '📱', title: 'Sign up & set your farm', desc: 'Create account with Google, set location, crops, and land size.' },
    { number: '02', icon: '📸', title: 'Scan your crops', desc: 'Upload photos for instant AI disease detection and treatment.' },
    { number: '03', icon: '🌤️', title: 'Get live advisories', desc: 'Receive hyperlocal weather alerts and irrigation schedules daily.' },
    { number: '04', icon: '📈', title: 'Sell at the right time', desc: 'Monitor Mandi prices and AI predictions to maximise profit.' },
  ],
  hi: [
    { number: '01', icon: '📱', title: 'साइन अप करें', desc: 'Google से खाता बनाएं, स्थान और फसलें सेट करें।' },
    { number: '02', icon: '📸', title: 'फसल स्कैन करें', desc: 'AI रोग पहचान के लिए फसल की फोटो अपलोड करें।' },
    { number: '03', icon: '🌤️', title: 'लाइव सलाह पाएं', desc: 'मौसम अलर्ट और सिंचाई शेड्यूल रोज़ पाएं।' },
    { number: '04', icon: '📈', title: 'सही समय पर बेचें', desc: 'मंडी भाव देखकर अधिकतम लाभ पर फसल बेचें।' },
  ],
}

const techStack = [
  { category: { en: 'Frontend', hi: 'फ्रंटएंड' }, items: ['React.js / Next.js', 'Tailwind CSS', 'Progressive Web App'] },
  { category: { en: 'Backend', hi: 'बैकएंड' }, items: ['Node.js', 'FastAPI', 'WebSocket'] },
  { category: { en: 'AI / ML', hi: 'AI / ML' }, items: ['TensorFlow', 'PyTorch', 'NLP Transformers', 'OpenCV'] },
  { category: { en: 'Database', hi: 'डेटाबेस' }, items: ['PostgreSQL', 'Supabase', 'Redis'] },
  { category: { en: 'APIs', hi: 'APIs' }, items: ['OpenWeather API', 'Satellite APIs', 'Govt Mandi APIs'] },
  { category: { en: 'Cloud', hi: 'क्लाउड' }, items: ['AWS', 'Google Cloud', 'Vercel'] },
]

export default function FeaturesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t, lang } = useLang()

  function handleNav(href: string) {
    if (!session) router.push('/auth/signin')
    else router.push(href)
  }

  // Pair features: [[f1,f2],[f3,f4],[f5,f6]]
  const pairs = features.reduce((acc: any[][], f, i) => {
    if (i % 2 === 0) acc.push([f])
    else acc[acc.length - 1].push(f)
    return acc
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#f5f0e8', color: '#1a1a1a' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)', top: -150, right: -150 }} />
      <Navbar />

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          {lang === 'hi' ? '6 शक्तिशाली विशेषताएं' : '6 powerful features'}
        </div>
        <h1 className="font-serif text-5xl lg:text-6xl text-green-50 mb-5 leading-tight">{t('everythingAFarmerNeeds')}</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(30,30,20,0.5)', lineHeight: 1.7 }}>
          {lang === 'hi' ? 'AgroSense AI, सैटेलाइट डेटा, IoT सेंसर और रियल-टाइम मार्केट इंटेलिजेंस को एक प्लेटफ़ॉर्म में जोड़ता है।' : 'AgroSense combines AI, satellite data, IoT sensors, and real-time market intelligence into one powerful platform for Indian farmers.'}
        </p>
        <div className="grid grid-cols-3 gap-8 mt-14 max-w-lg mx-auto">
          {[{ value: '2.4M+', label: t('farmers') }, { value: '95%', label: t('accuracy') }, { value: '12+', label: t('languages') }].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: '#16a34a' }}>{value}</div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(30,30,20,0.4)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="text-center mb-12">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: '#4ade80' }}>{lang === 'hi' ? 'यह कैसे काम करता है' : 'How it works'}</p>
          <h2 className="font-serif text-4xl text-green-50 mb-3">{lang === 'hi' ? '4 आसान चरणों में शुरू करें' : 'Get started in 4 simple steps'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps[lang as 'en' | 'hi'].map(({ number, icon, title, desc }, i) => (
            <div key={number} className="relative p-5 rounded-2xl transition-all"
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)')}>
              {i < 3 && <div className="hidden lg:block absolute top-8 -right-2 w-4 h-px" style={{ background: 'rgba(74,222,128,0.2)' }} />}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>{icon}</div>
                <span className="text-xs font-mono" style={{ color: 'rgba(74,222,128,0.3)' }}>{number}</span>
              </div>
              <h3 className="text-sm font-semibold text-green-100 mb-2">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(30,30,20,0.5)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — 2 per row */}
      <section className="max-w-6xl mx-auto px-8 pb-20 space-y-4">
        <div className="text-center mb-10">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: '#4ade80' }}>{lang === 'hi' ? 'विशेषताएं' : 'Features'}</p>
          <h2 className="font-serif text-4xl text-green-50">{t('everythingAFarmerNeeds')}</h2>
        </div>
        {pairs.map((pair, pi) => (
          <div key={pi} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pair.map(({ number, icon, accent, accentBg, accentBorder, titleKey, desc, points, tech, href, btnKey, visual }) => (
              <div key={number} className="p-6 rounded-2xl flex flex-col transition-all"
                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = accentBorder)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)')}>

                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: accentBg, border: `1px solid ${accentBorder}` }}>{icon}</div>
                    <div>
                      <span className="text-xs font-mono block mb-0.5" style={{ color: `${accent}60` }}>{number}</span>
                      <h3 className="text-sm font-semibold text-green-50">{t(titleKey as any)}</h3>
                    </div>
                  </div>
                  {/* Mini stat */}
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-xl font-bold" style={{ color: accent }}>{visual.stat}</div>
                    <div className="text-xs" style={{ color: 'rgba(30,30,20,0.4)' }}>{visual.statLabel}</div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(30,30,20,0.55)' }}>{desc[lang as 'en' | 'hi']}</p>

                <ul className="space-y-1.5 mb-4 flex-1">
                  {points[lang as 'en' | 'hi'].map((point, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(30,30,20,0.65)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />{point}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                  {tech.map(techItem => (
                    <span key={techItem} className="text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: accentBg, color: accent, border: `1px solid ${accentBorder}` }}>{techItem}</span>
                  ))}
                  <button onClick={() => handleNav(href)} className="ml-auto text-xs px-3 py-1 rounded-xl transition-all"
                    style={{ color: accent, border: `1px solid ${accentBorder}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = accentBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {t(btnKey as any)} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* TECH STACK */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="text-center mb-10">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: '#4ade80' }}>{lang === 'hi' ? 'तकनीक' : 'Technology'}</p>
          <h2 className="font-serif text-3xl text-green-50 mb-2">{lang === 'hi' ? 'हमारी तकनीक' : 'Built with modern tech'}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techStack.map(({ category, items }) => (
            <div key={category.en} className="p-5 rounded-2xl transition-all"
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)')}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(74,222,128,0.6)' }}>{category[lang as 'en' | 'hi']}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="text-xs flex items-center gap-2" style={{ color: 'rgba(30,30,20,0.7)' }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(74,222,128,0.5)' }} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl p-14 text-center" style={{ background: 'white', border: '1px solid rgba(74,222,128,0.15)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
          <div className="text-4xl mb-5">🌱</div>
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('readyToGrow')}</h2>
          <p className="mb-8 text-sm" style={{ color: 'rgba(30,30,20,0.5)' }}>{t('freeNoCard')}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => handleNav('/dashboard')} className="px-8 py-3.5 text-sm font-semibold text-white rounded-xl"
              style={{ background: '#16a34a' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
              {session ? t('goToDashboard') : t('getStartedFree')}
            </button>
            <button onClick={() => handleNav('/advisory')} className="px-8 py-3.5 text-sm rounded-xl transition-all"
              style={{ color: 'rgba(30,30,20,0.6)', border: '1px solid rgba(0,0,0,0.12)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)'; e.currentTarget.style.color = '#86efac' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(232,245,226,0.5)' }}>
              {session ? t('tryScanner') : t('signInToTry')}
            </button>
          </div>
        </div>
        <footer className="text-center text-xs mt-10" style={{ color: 'rgba(30,30,20,0.3)' }}>
          © 2026 AgroSense · AI-Powered Smart Farming · Built for Bharat 🇮🇳
        </footer>
      </section>
    </main>
  )
}