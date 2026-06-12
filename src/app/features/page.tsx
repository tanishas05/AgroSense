'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'
import { HERO_STATS, COPYRIGHT_YEAR } from '@/lib/config'

const features: Feature[] = [
  { number: '01', icon: '🔬', accent: '#a78bfa', accentBg: 'rgba(167,139,250,0.08)', accentBorder: 'rgba(167,139,250,0.2)', titleKey: 'aiDiseaseScanner', desc: { en: 'Upload a crop photo and get instant AI diagnosis powered by Groq Vision AI. Identifies diseases and suggests treatments.', hi: 'फसल की फोटो से Groq Vision AI द्वारा तत्काल रोग निदान और उपचार सुझाव।' }, points: { en: ['Detects common crop diseases', 'Nutrient deficiency detection', 'Treatment step recommendations', 'Scan history saved'], hi: ['सामान्य फसल रोग पहचानता है', 'पोषक तत्वों की कमी पहचानता है', 'उपचार चरण सुझाता है', 'स्कैन इतिहास सहेजा जाता है'] }, tech: ['Groq Vision AI', 'Llama 4 Scout'], href: '/advisory', btnKey: 'tryScanner', visual: { stat: 'AI', statLabel: 'Groq Vision · Llama 4', detail: 'Upload photo → instant result', sub: 'Confidence score included' } },
  { number: '02', icon: '🌦️', accent: '#38bdf8', accentBg: 'rgba(56,189,248,0.08)', accentBorder: 'rgba(56,189,248,0.2)', titleKey: 'weatherForecast', desc: { en: 'GPS-based hyperlocal weather forecasts powered by OpenWeatherMap. Alerts for rainfall and heatwaves.', hi: 'GPS आधारित हाइपरलोकल मौसम पूर्वानुमान। बारिश और गर्मी की लहर के लिए अलर्ट।' }, points: { en: ['GPS-based hyperlocal forecasts', 'Heatwave warnings', 'Rain probability alerts', '5-day rain probability'], hi: ['GPS आधारित सटीक पूर्वानुमान', 'गर्मी की चेतावनी', 'वर्षा संभावना अलर्ट', '5-दिन वर्षा पूर्वानुमान'] }, tech: ['OpenWeather API', 'GPS'], href: '/dashboard', btnKey: 'goToDashboard', visual: { stat: 'Live', statLabel: 'GPS · OpenWeatherMap', detail: 'Real weather after sign-in', sub: '5-day forecast included' } },
  { number: '03', icon: '💧', accent: '#4ade80', accentBg: 'rgba(74,222,128,0.08)', accentBorder: 'rgba(74,222,128,0.2)', titleKey: 'smartIrrigation', desc: { en: 'AI recommends irrigation timing and water amount based on weather data and humidity analysis. Helps reduce water waste.', hi: 'AI मौसम डेटा के आधार पर सटीक सिंचाई समय बताता है। पानी की बर्बादी कम करता है।' }, points: { en: ['Weather-based moisture estimate', 'Optimal irrigation timing', 'Prevents over-irrigation', 'Weather-based estimate'], hi: ['मौसम आधारित नमी अनुमान', 'सर्वोत्तम सिंचाई समय', 'अधिक सिंचाई रोकता है', 'मौसम आधारित अनुमान'] }, tech: ['Weather API'], href: '/dashboard', btnKey: 'goToDashboard', visual: { stat: '62%', statLabel: 'Est. Soil Moisture', detail: 'Example · based on weather', sub: 'Updates with live data' } },
  { number: '04', icon: '🌱', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', accentBorder: 'rgba(52,211,153,0.2)', titleKey: 'fertilizer', desc: { en: 'AI recommends fertilizer and nutrients based on your crop type and current weather conditions. Updated with every advisory.', hi: 'फसल प्रकार और मौसम के आधार पर AI खाद सिफारिशें। हर सलाह के साथ अपडेट।' }, points: { en: ['Crop + weather based advice', 'Weather-adjusted recommendations', 'Fertilizer timing guidance', 'AI-powered advisory'], hi: ['फसल और मौसम आधारित सलाह', 'मौसम-समायोजित सुझाव', 'खाद समय मार्गदर्शन', 'AI-संचालित सलाह'] }, tech: ['Groq AI'], href: '/advisory', btnKey: 'tryScanner', visual: { stat: 'NPK', statLabel: 'AI Recommendation', detail: 'Wheat · Based on weather', sub: 'Updated with each advisory' } },
  { number: '05', icon: '📈', accent: '#fbbf24', accentBg: 'rgba(251,191,36,0.08)', accentBorder: 'rgba(251,191,36,0.2)', titleKey: 'mandiPrices', desc: { en: 'Live government Mandi prices for key commodities across India. Know today\'s rates before you sell your harvest.', hi: 'प्रमुख फसलों के लाइव सरकारी मंडी भाव। फसल बेचने से पहले आज का रेट जानें।' }, points: { en: ['Live govt. Mandi prices', 'Price change tracking', 'Multiple commodity support', 'Market name & location'], hi: ['लाइव सरकारी मंडी भाव', 'मूल्य परिवर्तन ट्रैकिंग', 'अनेक फसलों का समर्थन', 'मंडी का नाम और स्थान'] }, tech: ['Govt Mandi API', 'data.gov.in'], href: '/market', btnKey: 'market', visual: { stat: '₹Live', statLabel: 'data.gov.in · Hourly', detail: 'Wheat · Onion · Tomato · Maize', sub: 'Real prices from govt API' } },
  { number: '06', icon: '🎙️', accent: '#f472b6', accentBg: 'rgba(244,114,182,0.08)', accentBorder: 'rgba(244,114,182,0.2)', titleKey: 'advisory', desc: { en: 'Voice-based farming advice in Hindi and English. More languages and SMS fallback coming soon.', hi: 'हिंदी और अंग्रेज़ी में आवाज़ आधारित खेती सलाह। अधिक भाषाएं जल्द आ रही हैं।' }, points: { en: ['Hindi & English voice support', 'Voice commands & responses', 'Requires internet connection', 'More languages coming soon'], hi: ['हिंदी और अंग्रेज़ी आवाज़ समर्थन', 'आवाज़ कमांड और उत्तर', 'इंटरनेट कनेक्शन आवश्यक', 'अधिक भाषाएं जल्द'] }, tech: ['Web Speech API', 'Groq AI'], href: '/advisory', btnKey: 'tryScanner', visual: { stat: '2', statLabel: 'Languages', detail: 'Hindi · English', sub: 'More languages coming soon' } },
]

const steps = {
  en: [
    { number: '01', icon: '📱', title: 'Sign up & set your farm', desc: 'Create account with Google, set location, crops, and land size.' },
    { number: '02', icon: '📸', title: 'Scan your crops', desc: 'Upload photos for instant AI disease detection and treatment.' },
    { number: '03', icon: '🌤️', title: 'Get live advisories', desc: 'Receive hyperlocal weather alerts and irrigation schedules daily.' },
    { number: '04', icon: '📈', title: 'Sell at the right time', desc: 'Monitor live Mandi prices from data.gov.in to know when to sell.' },
  ],
  hi: [
    { number: '01', icon: '📱', title: 'साइन अप करें', desc: 'Google से खाता बनाएं, स्थान और फसलें सेट करें।' },
    { number: '02', icon: '📸', title: 'फसल स्कैन करें', desc: 'AI रोग पहचान के लिए फसल की फोटो अपलोड करें।' },
    { number: '03', icon: '🌤️', title: 'लाइव सलाह पाएं', desc: 'मौसम अलर्ट और सिंचाई शेड्यूल रोज़ पाएं।' },
    { number: '04', icon: '📈', title: 'सही समय पर बेचें', desc: 'मंडी भाव देखकर अधिकतम लाभ पर फसल बेचें।' },
  ],
}

const techStack = [
  { category: { en: 'Frontend', hi: 'फ्रंटएंड' }, items: ['React.js / Next.js 14', 'Tailwind CSS', 'TypeScript'] },
  { category: { en: 'Backend', hi: 'बैकएंड' }, items: ['Next.js API Routes', 'NextAuth.js', 'Server-side Fetch'] },
  { category: { en: 'AI / ML', hi: 'AI / ML' }, items: ['Groq API', 'Llama 4 Scout (Vision)', 'Llama 3 (Text)'] },
  { category: { en: 'Database', hi: 'डेटाबेस' }, items: ['Supabase', 'PostgreSQL'] },
  { category: { en: 'APIs', hi: 'APIs' }, items: ['OpenWeather API', 'Nominatim / OSM', 'Govt Mandi API (data.gov.in)'] },
  { category: { en: 'Cloud', hi: 'क्लाउड' }, items: ['Vercel (deployment)', 'Supabase Cloud'] },
]

type Feature = {
  number: string
  icon: string
  accent: string
  accentBg: string
  accentBorder: string
  titleKey: string
  desc: Record<'en' | 'hi', string>
  points: Record<'en' | 'hi', string[]>
  tech: string[]
  href: string
  btnKey: string
  visual: { stat: string; statLabel: string; detail: string; sub: string }
}

export default function FeaturesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t, lang } = useLang()

  function handleNav(href: string) {
    if (!session) router.push('/auth/signin')
    else router.push(href)
  }

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
        <h1 className="font-serif text-5xl lg:text-6xl mb-5 leading-tight" style={{ color: '#1a1a14' }}>{t('everythingAFarmerNeeds')}</h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: 'rgba(30,30,20,0.5)', lineHeight: 1.7 }}>
          {lang === 'hi' ? 'AgroSense AI, रियल-टाइम मौसम डेटा, सरकारी मंडी भाव और आवाज़ सलाह को एक प्लेटफ़ॉर्म में जोड़ता है।' : 'AgroSense combines AI, real-time weather data, government Mandi prices, and voice advisory into one platform for Indian farmers.'}
        </p>
        <div className="grid grid-cols-3 gap-8 mt-14 max-w-lg mx-auto">
          {[
            { value: `${HERO_STATS.featuresCount.value}${HERO_STATS.featuresCount.suffix}`, label: t('featuresLabel') },
            { value: `${HERO_STATS.languagesCount.value}${HERO_STATS.languagesCount.suffix}`, label: t('languagesLabel') },
            { value: `${HERO_STATS.apisCount.value}${HERO_STATS.apisCount.suffix}`, label: t('apisLabel') },
          ].map(({ value, label }) => (
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
          <h2 className="font-serif text-4xl mb-3" style={{ color: '#1a1a14' }}>{lang === 'hi' ? '4 आसान चरणों में शुरू करें' : 'Get started in 4 simple steps'}</h2>
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
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#1a1a14' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(30,30,20,0.5)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — 2 per row */}
      <section className="max-w-6xl mx-auto px-8 pb-20 space-y-4">
        <div className="text-center mb-10">
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: '#4ade80' }}>{lang === 'hi' ? 'विशेषताएं' : 'Features'}</p>
          <h2 className="font-serif text-4xl" style={{ color: '#1a1a14' }}>{t('everythingAFarmerNeeds')}</h2>
        </div>
        {pairs.map((pair, pi) => (
          <div key={pi} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pair.map(({ number, icon, accent, accentBg, accentBorder, titleKey, desc, points, tech, href, btnKey, visual }) => (
              <div key={number} className="p-6 rounded-2xl flex flex-col transition-all"
                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = accentBorder)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: accentBg, border: `1px solid ${accentBorder}` }}>{icon}</div>
                    <div>
                      <span className="text-xs font-mono block mb-0.5" style={{ color: `${accent}60` }}>{number}</span>
                      <h3 className="text-sm font-semibold" style={{ color: '#1a1a14' }}>{t(titleKey as any)}</h3>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-xl font-bold" style={{ color: accent }}>{visual.stat}</div>
                    <div className="text-xs" style={{ color: 'rgba(30,30,20,0.4)' }}>{visual.statLabel}</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(30,30,20,0.55)' }}>{desc[lang as 'en' | 'hi']}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {points[lang as 'en' | 'hi'].map((point: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(30,30,20,0.65)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />{point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.02)' }}>
                  {tech.map((techItem: string) => (
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
          <h2 className="font-serif text-3xl mb-2" style={{ color: '#1a1a14' }}>{lang === 'hi' ? 'हमारी तकनीक' : 'Built with modern tech'}</h2>
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
          <h2 className="font-serif text-4xl mb-3" style={{ color: '#1a1a14' }}>{t('readyToGrow')}</h2>
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
          © {COPYRIGHT_YEAR} AgroSense · AI-Powered Smart Farming · Built for Bharat 🇮🇳
        </footer>
      </section>
    </main>
  )
}