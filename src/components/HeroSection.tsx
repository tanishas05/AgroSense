'use client'

import FieldCard from './FieldCard'
import { useRouter } from 'next/navigation'

const stats = [
  { value: '2.4M+', label: 'Farmers using AgroSense' },
  { value: '12 langs', label: 'Regional language support' },
  { value: '95%', label: 'Disease detection accuracy' },
]

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/25 text-xs text-green-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          AI-powered smart farming platform
        </div>

        <h1 className="font-serif text-5xl lg:text-6xl leading-tight text-green-50 mb-4 tracking-tight">
          Farm <em className="text-green-400 not-italic">smarter</em>,<br />
          harvest better.
        </h1>

        <p className="text-base text-green-100/50 leading-relaxed mb-8 max-w-lg">
          Real-time crop intelligence, hyperlocal weather advisories, and market price predictions — all in your regional language.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => router.push('/auth/signin')}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 hover:-translate-y-0.5 transition-all"
          >
            Start farming smarter
          </button>
          <button
            onClick={() => router.push('/features')}
            className="px-6 py-3.5 text-sm text-green-100/60 border border-green-100/15 rounded-lg hover:border-green-400/40 hover:text-green-300 transition-all"
          >
            See how it works →
          </button>
        </div>

        <div className="flex gap-8 mt-10 pt-8 border-t border-white/5">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-green-300">{value}</div>
              <div className="text-xs text-green-100/35 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative px-6">
        <FieldCard />
      </div>
    </section>
  )
}