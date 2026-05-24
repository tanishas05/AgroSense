const steps = [
  {
    number: '01',
    icon: '📱',
    title: 'Sign up & set your farm',
    desc: 'Create your account with Google, set your location, crops, and land size in your profile.',
  },
  {
    number: '02',
    icon: '📸',
    title: 'Scan your crops',
    desc: 'Upload photos of your crops to get instant AI disease detection and treatment recommendations.',
  },
  {
    number: '03',
    icon: '🌤️',
    title: 'Get live advisories',
    desc: 'Receive hyperlocal weather alerts, irrigation schedules, and fertilizer recommendations daily.',
  },
  {
    number: '04',
    icon: '📈',
    title: 'Sell at the right time',
    desc: 'Monitor live Mandi prices and AI predictions to sell your crop at maximum profit.',
  },
]

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-8 pb-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-xs text-green-400 mb-4">
          How it works
        </div>
        <h2 className="font-serif text-4xl text-green-50 mb-3">Get started in 4 simple steps</h2>
        <p className="text-sm text-green-100/40 max-w-xl mx-auto">
          AgroSense is designed to be simple enough for any farmer to use, even with low digital literacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map(({ number, icon, title, desc }, i) => (
          <div key={number} className="relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-green-400/10 z-0" />
            )}
            <div className="relative z-10 bg-green-950/60 border border-green-400/15 rounded-xl p-5 hover:border-green-400/25 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                <span className="text-xs text-green-100/20 font-mono">{number}</span>
              </div>
              <h3 className="text-sm font-semibold text-green-100 mb-2">{title}</h3>
              <p className="text-xs text-green-100/40 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}