'use client'

import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'

const features = [
  {
    number: '01', icon: '🔬',
    titleKey: 'aiDiseaseScanner',
    desc: { en: 'Upload a photo of your crop and get instant AI-powered diagnosis with 95% accuracy. Identifies diseases, nutrient deficiencies, and suggests specific treatments.', hi: 'अपनी फसल की फोटो अपलोड करें और 95% सटीकता के साथ तत्काल AI निदान पाएं।' },
    points: { en: ['Detects 50+ crop diseases instantly', 'Identifies nutrient deficiencies from photos', 'Suggests specific treatment steps', 'Works offline with cached models'], hi: ['50+ फसल रोग तुरंत पहचानता है', 'फोटो से पोषक तत्वों की कमी पहचानता है', 'विशिष्ट उपचार चरण सुझाता है', 'ऑफलाइन भी काम करता है'] },
    tech: ['CNN / Vision AI', 'TensorFlow', 'PyTorch'],
    href: '/advisory',
    btnKey: 'tryScanner',
  },
  {
    number: '02', icon: '🌦️',
    titleKey: 'weatherForecast',
    desc: { en: 'Get village-level weather forecasts with 1km accuracy using GPS, satellite data, and weather APIs. Receive alerts for rainfall, frost, heatwaves, and optimal sowing windows.', hi: 'GPS, सैटेलाइट डेटा और मौसम API का उपयोग करके 1km सटीकता के साथ गांव-स्तरीय मौसम पूर्वानुमान प्राप्त करें।' },
    points: { en: ['1km accuracy hyperlocal forecasts', 'Heatwave and frost early warnings', 'Optimal sowing time recommendations', '7-day forecast with rain probability'], hi: ['1km सटीकता का पूर्वानुमान', 'गर्मी और पाले की पूर्व चेतावनी', 'बुवाई के लिए सर्वोत्तम समय', '7-दिन का वर्षा पूर्वानुमान'] },
    tech: ['OpenWeather API', 'Satellite Data', 'GPS'],
    href: '/dashboard',
    btnKey: 'goToDashboard',
  },
  {
    number: '03', icon: '💧',
    titleKey: 'smartIrrigation',
    desc: { en: 'AI analyzes soil moisture, crop type, and weather conditions to recommend the exact amount of water and optimal irrigation timing, reducing water waste by up to 40%.', hi: 'AI मिट्टी की नमी, फसल प्रकार और मौसम का विश्लेषण करके सटीक सिंचाई की सिफारिश करता है।' },
    points: { en: ['Real-time soil moisture monitoring', 'Optimal irrigation timing recommendations', 'Prevents over and under irrigation', 'Reduces electricity costs significantly'], hi: ['रियल-टाइम मिट्टी नमी निगरानी', 'सर्वोत्तम सिंचाई समय की सिफारिश', 'अधिक और कम सिंचाई रोकता है', 'बिजली की लागत कम करता है'] },
    tech: ['IoT Sensors', 'ML Models', 'Soil Analysis'],
    href: '/dashboard',
    btnKey: 'goToDashboard',
  },
  {
    number: '04', icon: '🌱',
    titleKey: 'fertilizer',
    desc: { en: 'Get precise NPK fertilizer recommendations based on your crop type, soil health, and growth stage. Reduce fertilizer costs while improving soil health and crop yield.', hi: 'अपनी फसल प्रकार, मिट्टी स्वास्थ्य के आधार पर सटीक NPK उर्वरक सिफारिशें प्राप्त करें।' },
    points: { en: ['Exact NPK quantity recommendations', 'Organic matter scheduling', 'Reduces fertilizer costs by 25%', 'Improves soil health over time'], hi: ['सटीक NPK मात्रा की सिफारिश', 'जैविक पदार्थ शेड्यूलिंग', 'उर्वरक लागत 25% कम करता है', 'मिट्टी स्वास्थ्य में सुधार'] },
    tech: ['Soil Analysis', 'AI Models', 'Crop Database'],
    href: '/advisory',
    btnKey: 'tryScanner',
  },
  {
    number: '05', icon: '📈',
    titleKey: 'mandiPrices',
    desc: { en: 'Access live Mandi prices from across India and AI-powered 7-day price predictions. Know the best market, best time to sell, and expected price movements before they happen.', hi: 'भारत भर से लाइव मंडी भाव और AI-संचालित 7-दिवसीय मूल्य पूर्वानुमान प्राप्त करें।' },
    points: { en: ['Live prices from 3000+ Mandis', '7-day price forecasts with AI', 'Best market and timing recommendations', 'Historical price trend analysis'], hi: ['3000+ मंडियों से लाइव भाव', 'AI के साथ 7-दिन का मूल्य पूर्वानुमान', 'सर्वोत्तम बाज़ार और समय की सिफारिश', 'ऐतिहासिक मूल्य प्रवृत्ति विश्लेषण'] },
    tech: ['Govt Mandi APIs', 'ML Forecasting', 'Price Models'],
    href: '/market',
    btnKey: 'market',
  },
  {
    number: '06', icon: '🎙️',
    titleKey: 'advisory',
    desc: { en: 'Speak to AgroSense in your regional language and get voice-based advisories. Designed for farmers with low digital literacy, works in low-network rural areas.', hi: 'अपनी क्षेत्रीय भाषा में AgroSense से बात करें और आवाज़-आधारित सलाह प्राप्त करें।' },
    points: { en: ['Supports 12+ Indian languages', 'Voice commands and responses', 'Works offline in rural areas', 'SMS-based fallback system'], hi: ['12+ भारतीय भाषाओं का समर्थन', 'आवाज़ कमांड और उत्तर', 'ग्रामीण क्षेत्रों में ऑफलाइन काम', 'SMS-आधारित बैकअप सिस्टम'] },
    tech: ['NLP Transformers', 'Speech API', 'Translation'],
    href: '/profile',
    btnKey: 'languagePref',
  },
]

const steps = {
  en: [
    { number: '01', icon: '📱', title: 'Sign up & set your farm', desc: 'Create your account with Google, set your location, crops, and land size in your profile.' },
    { number: '02', icon: '📸', title: 'Scan your crops', desc: 'Upload photos of your crops to get instant AI disease detection and treatment recommendations.' },
    { number: '03', icon: '🌤️', title: 'Get live advisories', desc: 'Receive hyperlocal weather alerts, irrigation schedules, and fertilizer recommendations daily.' },
    { number: '04', icon: '📈', title: 'Sell at the right time', desc: 'Monitor live Mandi prices and AI predictions to sell your crop at maximum profit.' },
  ],
  hi: [
    { number: '01', icon: '📱', title: 'साइन अप करें और खेत सेट करें', desc: 'Google से खाता बनाएं, अपना स्थान, फसलें और भूमि का आकार प्रोफ़ाइल में सेट करें।' },
    { number: '02', icon: '📸', title: 'फसल स्कैन करें', desc: 'तत्काल AI रोग पहचान और उपचार सिफारिशों के लिए फसल की फोटो अपलोड करें।' },
    { number: '03', icon: '🌤️', title: 'लाइव सलाह प्राप्त करें', desc: 'हाइपरलोकल मौसम अलर्ट, सिंचाई शेड्यूल और खाद सिफारिशें रोज़ पाएं।' },
    { number: '04', icon: '📈', title: 'सही समय पर बेचें', desc: 'लाइव मंडी भाव और AI पूर्वानुमान देखकर अधिकतम लाभ पर फसल बेचें।' },
  ],
}

export default function FeaturesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t, lang } = useLang()

  function handleNav(href: string) {
    if (href !== '/' && !session) router.push('/auth/signin')
    else router.push(href)
  }

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', top: -100, right: -100 }} />
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/25 text-xs text-green-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          6 {lang === 'hi' ? 'शक्तिशाली विशेषताएं' : 'powerful features'}
        </div>
        <h1 className="font-serif text-5xl lg:text-6xl text-green-50 mb-5 leading-tight tracking-tight">
          {t('everythingAFarmerNeeds')}
        </h1>
        <p className="text-base text-green-100/45 max-w-2xl mx-auto">
          {lang === 'hi' ? 'AgroSense AI, सैटेलाइट डेटा, IoT सेंसर और रियल-टाइम मार्केट इंटेलिजेंस को एक शक्तिशाली प्लेटफ़ॉर्म में जोड़ता है।' : 'AgroSense combines AI, satellite data, IoT sensors, and real-time market intelligence into one powerful platform built for Indian farmers.'}
        </p>

        <div className="grid grid-cols-3 gap-6 mt-14 max-w-2xl mx-auto">
          {[
            { value: '2.4M+', label: t('farmers') },
            { value: '95%', label: t('accuracy') },
            { value: '12', label: t('languages') },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-green-300 mb-1">{value}</div>
              <div className="text-xs text-green-100/35">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-xs text-green-400 mb-4">
            {t('howItWorks')}
          </div>
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('getStartedSteps')}</h2>
          <p className="text-sm text-green-100/40 max-w-xl mx-auto">{t('stepsDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps[lang].map(({ number, icon, title, desc }) => (
            <div key={number} className="bg-green-950/50 border border-green-400/10 rounded-xl p-5 hover:border-green-400/25 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-green-100/20 font-mono">{number}</span>
              </div>
              <h3 className="text-sm font-semibold text-green-100 mb-2">{title}</h3>
              <p className="text-xs text-green-100/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features list */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="space-y-6">
          {features.map(({ number, icon, titleKey, desc, points, tech, href, btnKey }, i) => (
            <div key={number} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 bg-green-950/40 border border-green-400/10 rounded-2xl hover:border-green-400/20 transition-all ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-green-100/25 font-mono">{number}</span>
                  <span className="text-2xl">{icon}</span>
                </div>
                <h2 className="font-serif text-2xl text-green-50 mb-3">{t(titleKey as any)}</h2>
                <p className="text-sm text-green-100/45 leading-relaxed mb-5">{desc[lang]}</p>
                <ul className="space-y-2 mb-5">
                  {points[lang].map((point, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-xs text-green-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-2">
                  {tech.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md border bg-green-400/10 text-green-400 border-green-400/20">{t}</span>
                  ))}
                  <button onClick={() => handleNav(href)} className="ml-auto text-xs px-4 py-1.5 rounded-lg border border-green-400/25 text-green-400 hover:bg-green-400/8 transition-all">
                    {t(btnKey as any)} →
                  </button>
                </div>
              </div>
              <div className={`bg-green-400/3 border border-green-400/15 rounded-xl p-6 h-48 flex items-center justify-center ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="text-center">
                  <div className="text-6xl mb-3">{icon}</div>
                  <div className="text-xs text-green-100/25">{t(titleKey as any)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-green-50 mb-2">{t('techStack')}</h2>
          <p className="text-sm text-green-100/40">{t('techDesc')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { category: lang === 'hi' ? 'फ्रंटएंड' : 'Frontend', items: ['React.js / Next.js', 'Tailwind CSS', 'Progressive Web App'] },
            { category: lang === 'hi' ? 'बैकएंड' : 'Backend', items: ['Node.js', 'FastAPI', 'WebSocket'] },
            { category: 'AI / ML', items: ['TensorFlow', 'PyTorch', 'NLP Transformers', 'OpenCV'] },
            { category: lang === 'hi' ? 'डेटाबेस' : 'Database', items: ['MongoDB', 'PostgreSQL', 'Supabase'] },
            { category: 'APIs', items: ['OpenWeather API', 'Satellite APIs', 'Govt Mandi APIs'] },
            { category: lang === 'hi' ? 'क्लाउड' : 'Cloud', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
          ].map(({ category, items }) => (
            <div key={category} className="border border-green-400/15 rounded-xl p-5 bg-green-950/40">
              <h3 className="text-xs font-semibold text-green-100/60 uppercase tracking-wider mb-3">{category}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="text-sm text-green-100/80 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-400/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="rounded-3xl p-14 text-center bg-green-700/20 border border-green-400/20">
          <div className="text-4xl mb-4">🌱</div>
          <h2 className="font-serif text-4xl text-green-50 mb-3">{t('readyToGrow')}</h2>
          <p className="text-green-100/45 text-base mb-8 max-w-md mx-auto">{t('freeNoCard')}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => handleNav('/dashboard')} className="px-8 py-3.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all">
              {session ? t('goToDashboard') : t('getStartedFree')}
            </button>
            <button onClick={() => handleNav('/advisory')} className="px-8 py-3.5 text-sm text-green-100/60 border border-green-100/15 rounded-xl hover:border-green-400/40 hover:text-green-300 transition-all">
              {session ? t('tryScanner') : t('signInToTry')}
            </button>
          </div>
        </div>
        <footer className="text-center text-xs mt-12 text-green-100/20">
          © 2026 AgroSense · AI-Powered Smart Farming · Built for Bharat 🇮🇳
        </footer>
      </section>
    </main>
  )
}