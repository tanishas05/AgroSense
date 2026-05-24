'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const features = [
  {
    number: '01',
    icon: '🔬',
    title: 'AI Crop Disease Detection',
    description: 'Upload a photo of your crop and get instant AI-powered diagnosis with 95% accuracy. Our CNN/Vision AI model identifies diseases, nutrient deficiencies, and suggests specific treatments.',
    points: [
      'Detects 50+ crop diseases instantly',
      'Identifies nutrient deficiencies from photos',
      'Suggests specific treatment steps',
      'Works offline with cached models',
    ],
    tech: ['CNN / Vision AI', 'TensorFlow', 'PyTorch'],
    color: 'green',
    action: { label: 'Try Disease Scanner →', href: '/advisory' },
  },
  {
    number: '02',
    icon: '🌦️',
    title: 'Hyperlocal Weather Intelligence',
    description: 'Get village-level weather forecasts with 1km accuracy using GPS, satellite data, and weather APIs. Receive alerts for rainfall, frost, heatwaves, and optimal sowing windows.',
    points: [
      '1km accuracy hyperlocal forecasts',
      'Heatwave and frost early warnings',
      'Optimal sowing time recommendations',
      '7-day forecast with rain probability',
    ],
    tech: ['OpenWeather API', 'Satellite Data', 'GPS'],
    color: 'blue',
    action: { label: 'View Dashboard →', href: '/dashboard' },
  },
  {
    number: '03',
    icon: '💧',
    title: 'Smart Irrigation System',
    description: 'AI analyzes soil moisture, crop type, and weather conditions to recommend the exact amount of water and optimal irrigation timing, reducing water waste by up to 40%.',
    points: [
      'Real-time soil moisture monitoring',
      'Optimal irrigation timing recommendations',
      'Prevents over and under irrigation',
      'Reduces electricity costs significantly',
    ],
    tech: ['IoT Sensors', 'ML Models', 'Soil Analysis'],
    color: 'cyan',
    action: { label: 'View Dashboard →', href: '/dashboard' },
  },
  {
    number: '04',
    icon: '🌱',
    title: 'Fertilizer & Resource Optimization',
    description: 'Get precise NPK fertilizer recommendations based on your crop type, soil health, and growth stage. Reduce fertilizer costs while improving soil health and crop yield.',
    points: [
      'Exact NPK quantity recommendations',
      'Organic matter scheduling',
      'Reduces fertilizer costs by 25%',
      'Improves soil health over time',
    ],
    tech: ['Soil Analysis', 'AI Models', 'Crop Database'],
    color: 'green',
    action: { label: 'Get Advisory →', href: '/advisory' },
  },
  {
    number: '05',
    icon: '📈',
    title: 'Market Price Prediction',
    description: 'Access live Mandi prices from across India and AI-powered 7-day price predictions. Know the best market, best time to sell, and expected price movements before they happen.',
    points: [
      'Live prices from 3000+ Mandis',
      '7-day price forecasts with AI',
      'Best market and timing recommendations',
      'Historical price trend analysis',
    ],
    tech: ['Govt Mandi APIs', 'ML Forecasting', 'Price Models'],
    color: 'yellow',
    action: { label: 'View Market Prices →', href: '/market' },
  },
  {
    number: '06',
    icon: '🎙️',
    title: 'Multilingual Voice Assistant',
    description: 'Speak to AgroSense in your regional language and get voice-based advisories. Designed for farmers with low digital literacy, works in low-network rural areas.',
    points: [
      'Supports 12+ Indian languages',
      'Voice commands and responses',
      'Works offline in rural areas',
      'SMS-based fallback system',
    ],
    tech: ['NLP Transformers', 'Speech API', 'Translation'],
    color: 'purple',
    action: { label: 'Set Language →', href: '/profile' },
  },
]

const colorMap: Record<string, { badge: string; dot: string; border: string; btn: string }> = {
  green: { badge: 'bg-green-400/10 text-green-400 border-green-400/20', dot: 'bg-green-400', border: 'border-green-400/20', btn: 'text-green-400 border-green-400/25 hover:bg-green-400/10' },
  blue: { badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20', dot: 'bg-blue-400', border: 'border-blue-400/20', btn: 'text-blue-400 border-blue-400/25 hover:bg-blue-400/10' },
  cyan: { badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20', dot: 'bg-cyan-400', border: 'border-cyan-400/20', btn: 'text-cyan-400 border-cyan-400/25 hover:bg-cyan-400/10' },
  yellow: { badge: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', dot: 'bg-yellow-400', border: 'border-yellow-400/20', btn: 'text-yellow-400 border-yellow-400/25 hover:bg-yellow-400/10' },
  purple: { badge: 'bg-purple-400/10 text-purple-400 border-purple-400/20', dot: 'bg-purple-400', border: 'border-purple-400/20', btn: 'text-purple-400 border-purple-400/25 hover:bg-purple-400/10' },
}

export default function FeaturesList() {
  const { data: session } = useSession()
  const router = useRouter()

  function handleAction(href: string) {
    if (session) {
      router.push(href)
    } else {
      router.push('/auth/signin')
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-8 pb-20">
      <div className="space-y-6">
        {features.map(({ number, icon, title, description, points, tech, color, action }, i) => {
          const c = colorMap[color] ?? colorMap.green
          const isEven = i % 2 === 1

          return (
            <div
              key={title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 bg-green-950/40 border border-green-400/10 rounded-2xl hover:border-green-400/20 transition-all ${isEven ? 'lg:grid-flow-col-dense' : ''}`}
            >
              {/* Content */}
              <div className={isEven ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-green-100/25 font-mono">{number}</span>
                  <span className="text-2xl">{icon}</span>
                </div>
                <h2 className="font-serif text-2xl text-green-50 mb-3">{title}</h2>
                <p className="text-sm text-green-100/45 leading-relaxed mb-5">{description}</p>

                <ul className="space-y-2 mb-5">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-xs text-green-100/60">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2">
                  {tech.map((t) => (
                    <span key={t} className={`text-[10px] px-2.5 py-1 rounded-md border ${c.badge}`}>
                      {t}
                    </span>
                  ))}
                  <button
                    onClick={() => handleAction(action.href)}
                    className={`ml-auto text-xs px-4 py-1.5 rounded-lg border transition-all ${c.btn}`}
                  >
                    {action.label}
                  </button>
                </div>
              </div>

              {/* Visual */}
              <div className={`bg-green-400/3 border ${c.border} rounded-xl p-6 h-48 flex items-center justify-center ${isEven ? 'lg:col-start-1' : ''}`}>
                <div className="text-center">
                  <div className="text-6xl mb-3">{icon}</div>
                  <div className="text-xs text-green-100/25">{title}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}