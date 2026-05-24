'use client'

export default function FieldCard() {
  return (
    <div className="relative h-[400px]">
      {/* Main card */}
      <div className="absolute top-0 left-0 right-0 bg-green-950/90 border border-green-400/20 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-green-100/40 font-medium">Field overview — Nashik, MH</span>
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
            Live
          </span>
        </div>

        <div className="relative bg-green-900/20 border border-green-400/10 rounded-xl h-36 overflow-hidden mb-4">
          <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 420 140" preserveAspectRatio="none">
            <polygon points="60,30 180,20 280,50 360,30 400,60 380,110 60,110" fill="#16a34a" stroke="#4ade80" strokeWidth="1"/>
            <polygon points="100,60 200,55 260,80 200,100 100,95" fill="#0f6e56" stroke="#4ade80" strokeWidth="0.5"/>
          </svg>
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute" style={{ top: '40%', left: '45%' }}>
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full border border-green-400/40 ping-slow" />
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-green-950" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: '28°C', label: 'Temperature' },
            { val: '70%', label: 'Humidity' },
            { val: '85%', label: 'Rain chance' },
          ].map(({ val, label }) => (
            <div key={label} className="bg-green-400/5 border border-green-400/10 rounded-lg p-2.5">
              <div className="text-lg font-bold text-green-400">{val}</div>
              <div className="text-[10px] text-green-100/30 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[11px] text-green-100/30">
          <span>Irrigation: Tomorrow 6AM · 25mm</span>
          <span className="text-green-400">✓ Optimal</span>
        </div>
      </div>

      {/* Disease scan card */}
      <div className="absolute top-14 -right-6 bg-green-950/95 border border-green-400/15 rounded-xl p-3.5 w-44 backdrop-blur-sm shadow-lg">
        <div className="text-[10px] text-green-100/40 mb-2">Disease scan result</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-green-100/65">
            <div className="flex-1">
              <div>Leaf Blight</div>
              <div className="h-0.5 bg-green-400/15 rounded mt-1 overflow-hidden">
                <div className="h-full bg-green-400 rounded" style={{ width: '95%' }} />
              </div>
            </div>
            <span className="ml-2 text-green-400 text-[10px]">95%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-green-100/65">
            <div className="flex-1">
              <div>N-Deficiency</div>
              <div className="h-0.5 bg-green-400/15 rounded mt-1 overflow-hidden">
                <div className="h-full bg-yellow-300 rounded" style={{ width: '40%' }} />
              </div>
            </div>
            <span className="ml-2 text-yellow-300 text-[10px]">Low</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-green-400/10 text-[10px] text-green-100/35">
          Spray Trichoderma + copper fungicide
        </div>
      </div>

      {/* Market alert card */}
      <div className="absolute -bottom-0 -left-5 -right-5 bg-green-950/95 border border-green-400/20 rounded-xl p-3 flex items-center gap-3 backdrop-blur-sm shadow-lg">
        <div className="w-9 h-9 bg-yellow-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fde047" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-yellow-300 text-[11px] font-medium">Wheat price rising at Indore Mandi</div>
          <div className="text-[11px] text-green-100/50 mt-0.5">Expected +8% in 7 days · Best sell: 5–7 days</div>
        </div>
        <div className="px-2 py-1 bg-yellow-400/10 rounded text-yellow-300 text-[10px] flex-shrink-0">
          Market alert
        </div>
      </div>
    </div>
  )
}