const stack = [
  {
    category: 'Frontend',
    color: 'border-blue-400/20 bg-blue-400/5',
    items: ['React.js / Next.js', 'Tailwind CSS', 'Progressive Web App'],
  },
  {
    category: 'Backend',
    color: 'border-green-400/20 bg-green-400/5',
    items: ['Node.js', 'FastAPI', 'WebSocket'],
  },
  {
    category: 'AI / ML',
    color: 'border-purple-400/20 bg-purple-400/5',
    items: ['TensorFlow', 'PyTorch', 'NLP Transformers', 'OpenCV'],
  },
  {
    category: 'Database',
    color: 'border-yellow-400/20 bg-yellow-400/5',
    items: ['MongoDB', 'PostgreSQL'],
  },
  {
    category: 'APIs',
    color: 'border-cyan-400/20 bg-cyan-400/5',
    items: ['OpenWeather API', 'Satellite APIs', 'Govt Mandi APIs'],
  },
  {
    category: 'Cloud',
    color: 'border-orange-400/20 bg-orange-400/5',
    items: ['AWS', 'Microsoft Azure', 'Google Cloud'],
  },
]

export default function TechStack() {
  return (
    <section className="max-w-6xl mx-auto px-8 pb-20">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl text-green-50 mb-2">Built with modern tech</h2>
        <p className="text-sm text-green-100/40">Enterprise-grade infrastructure for reliable farming intelligence</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stack.map(({ category, color, items }) => (
          <div key={category} className={`border rounded-xl p-5 ${color}`}>
            <h3 className="text-xs font-semibold text-green-100/60 uppercase tracking-wider mb-3">{category}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
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
  )
}