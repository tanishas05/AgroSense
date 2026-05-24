export default function FeaturesHero() {
  return (
    <section className="max-w-5xl mx-auto px-8 py-20 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/25 text-xs text-green-400 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
        6 powerful features
      </div>
      <h1 className="font-serif text-5xl lg:text-6xl text-green-50 mb-5 leading-tight tracking-tight">
        Everything you need to<br />
        <em className="text-green-400 not-italic">farm smarter</em>
      </h1>
      <p className="text-base text-green-100/45 max-w-2xl mx-auto leading-relaxed">
        AgroSense combines AI, satellite data, IoT sensors, and real-time market intelligence
        into one powerful platform built for Indian farmers.
      </p>

      <div className="grid grid-cols-3 gap-6 mt-14 max-w-2xl mx-auto">
        {[
          { value: '2.4M+', label: 'Farmers' },
          { value: '95%', label: 'Disease accuracy' },
          { value: '12', label: 'Languages' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-bold text-green-300 mb-1">{value}</div>
            <div className="text-xs text-green-100/35">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}