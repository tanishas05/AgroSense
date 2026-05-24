'use client'

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)',
          top: -120, right: -120,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
          bottom: 0, left: 80,
        }}
      />

      <Navbar />
      <HeroSection />

      <div className="max-w-6xl mx-auto px-8">
        <div className="border-t border-green-400/10" />
      </div>

      <FeaturesSection />

      <section className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        <div
          style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(74,222,128,0.2)' }}
          className="rounded-3xl p-12 text-center"
        >
          <h2 className="font-serif text-4xl text-green-50 mb-3">Ready to transform your farm?</h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'rgba(232,245,226,0.45)' }}>
            Join 2.4 million farmers already using AgroSense to make smarter decisions every day.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => router.push('/auth/signin')}
              className="px-8 py-4 text-base font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all"
            >
              Get started for free
            </button>
            <button
              onClick={() => router.push('/features')}
              className="px-8 py-4 text-base text-green-100/60 border border-green-100/15 rounded-xl hover:border-green-400/40 hover:text-green-300 transition-all"
            >
              See how it works
            </button>
          </div>
        </div>
      </section>

      <footer
        className="relative z-10 py-8 text-center text-xs"
        style={{ borderTop: '1px solid rgba(74,222,128,0.08)', color: 'rgba(232,245,226,0.25)' }}
      >
        © 2026 AgroSense · AI-Powered Smart Farming · Built for Bharat
      </footer>
    </main>
  )
}