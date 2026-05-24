'use client'

import { useRouter } from 'next/navigation'

const features = [
  {
    icon: '🔬',
    title: 'AI Crop Disease Detection',
    desc: 'Upload a photo and get instant diagnosis with 95% accuracy using CNN/Vision AI models.',
    tag: 'CNN · TensorFlow',
  },
  {
    icon: '🌦️',
    title: 'Hyperlocal Weather Intelligence',
    desc: 'Village-level forecasts using GPS, satellite data, and weather APIs.',
    tag: 'Satellite · GPS',
  },
  {
    icon: '💧',
    title: 'Smart Irrigation System',
    desc: 'Analyzes soil moisture and crop type to recommend optimal irrigation timing.',
    tag: 'IoT Sensors',
  },
  {
    icon: '🌱',
    title: 'Fertilizer Optimization',
    desc: 'AI recommends exact NPK quantities tailored to your crop and soil.',
    tag: 'AI · ML',
  },
  {
    icon: '📈',
    title: 'Market Price Prediction',
    desc: 'Live Mandi prices and 7-day forecasts so you sell at the right time.',
    tag: 'Live Mandi APIs',
  },
  {
    icon: '🎙️',
    title: 'Multilingual Voice Assistant',
    desc: 'Speak in Hindi, Punjabi, Tamil, Marathi, Telugu, Kannada and more.',
    tag: '12+ Languages',
  },
]

export default function FeaturesSection() {
  const router = useRouter()

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-8 py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-xs text-green-400 mb-4">
          Core features
        </div>
        <h2 className="font-serif text-4xl text-green-50 mb-3">Everything a farmer needs</h2>
        <p className="text-green-100/40 text-base max-w-xl mx-auto">
          Six intelligent modules working together to give every farmer a data-driven edge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ icon, title, desc, tag }) => (
          <div
            key={title}
            className="bg-green-950/50 border border-green-400/10 rounded-2xl p-6 hover:border-green-400/25 hover:bg-green-950/80 transition-all"
          >
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-sm font-semibold text-green-100 mb-2">{title}</h3>
            <p className="text-xs text-green-100/40 leading-relaxed mb-4">{desc}</p>
            <span className="inline-block text-[10px] px-2 py-1 bg-green-400/8 border border-green-400/15 rounded text-green-400/70">
              {tag}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => router.push('/features')}
          className="px-8 py-3.5 text-sm font-medium text-green-300 border border-green-400/25 rounded-xl hover:bg-green-400/8 hover:border-green-400/40 transition-all"
        >
          See full feature details →
        </button>
      </div>
    </section>
  )
}