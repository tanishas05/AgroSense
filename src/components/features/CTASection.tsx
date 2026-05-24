import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="max-w-6xl mx-auto px-8 pb-20">
      <div
        className="rounded-3xl p-14 text-center relative overflow-hidden"
        style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(74,222,128,0.2)' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
            top: -100, left: '50%', transform: 'translateX(-50%)',
          }}
        />
        <div className="relative z-10">
          <div className="text-4xl mb-4">🌱</div>
          <h2 className="font-serif text-4xl text-green-50 mb-3">
            Ready to grow smarter?
          </h2>
          <p className="text-green-100/45 text-base mb-8 max-w-md mx-auto">
            Join 2.4 million farmers already using AgroSense to make better decisions every day.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/advisory"
              className="px-8 py-3.5 text-sm text-green-100/60 border border-green-100/15 rounded-xl hover:border-green-400/40 hover:text-green-300 transition-all"
            >
              Try Disease Scanner
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs mt-12" style={{ color: 'rgba(232,245,226,0.2)' }}>
        © 2026 AgroSense · AI-Powered Smart Farming · Built for Bharat 🇮🇳
      </footer>
    </section>
  )
}