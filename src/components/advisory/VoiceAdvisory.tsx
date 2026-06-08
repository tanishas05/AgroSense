'use client'

import { useRef, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

const SAMPLE_QUESTIONS = {
  en: [
    'What disease does my tomato crop have?',
    'When should I irrigate my wheat?',
    'What is today\'s onion price?',
    'My crop leaves are turning yellow',
  ],
  hi: [
    'मेरी टमाटर फसल में क्या रोग है?',
    'गेहूं में सिंचाई कब करें?',
    'आज प्याज का भाव क्या है?',
    'मेरी फसल की पत्तियाँ पीली हो रही हैं',
  ],
}

export default function VoiceAdvisory() {
  const { lang } = useLang()
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const recRef = useRef<any>(null)
  // ref holds latest transcript so onend closure is never stale
  const transcriptRef = useRef('')

  async function getAIResponse(query: string) {
    if (!query.trim()) return
    setLoading(true)
    setResponse('')
    try {
      // Get live weather for context
      const loc = await new Promise<{ lat: number; lon: number }>(res =>
        navigator.geolocation.getCurrentPosition(
          p => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
          () => res({ lat: 28.6667, lon: 77.2167 })
        )
      )
      const weatherRes = await fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}&type=current`)
      const weather = await weatherRes.json()
      const temp = Math.round(weather.main?.temp ?? 28)
      const humidity = weather.main?.humidity ?? 65
      const description = weather.weather?.[0]?.description ?? 'partly cloudy'

      const res = await fetch('/api/crop-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: query,          // pass the voice query as the "crop" context
          weather: { temp, humidity, description },
        }),
      })
      const data = await res.json()

      // Build a combined response from all advisory fields
      const parts = [
        data.irrigation,
        data.fertilizer,
        data.pestControl,
      ].filter(Boolean)

      const advice = parts.length > 0
        ? parts.join(' | ')
        : (lang === 'hi' ? 'अभी सलाह उपलब्ध नहीं है। कृपया दोबारा प्रयास करें।' : 'No advice available right now. Please try again.')

      setResponse(advice)

      // Speak back
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(advice)
        utter.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
        utter.rate = 0.88
        window.speechSynthesis.speak(utter)
      }
    } catch {
      setResponse(lang === 'hi'
        ? 'माफ करें, अभी उत्तर नहीं मिल सका।'
        : 'Sorry, could not get a response right now.')
    } finally {
      setLoading(false)
    }
  }

  function startListening() {
    setError('')
    setResponse('')
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setError(lang === 'hi'
        ? 'यह ब्राउज़र आवाज़ नहीं समझता। Chrome इस्तेमाल करें।'
        : 'Voice not supported. Please use Chrome.')
      return
    }
    // reset ref before each session
    transcriptRef.current = ''

    const rec = new SR()
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    rec.continuous = false
    rec.interimResults = true

    rec.onstart = () => setListening(true)

    rec.onresult = (e: any) => {
      const txt = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join('')
      transcriptRef.current = txt   // always write to ref
      setTranscript(txt)            // also update display state
    }

    rec.onend = () => {
      setListening(false)
      // read from ref, not from stale state closure
      const finalText = transcriptRef.current
      if (finalText.trim()) {
        getAIResponse(finalText)
      }
    }

    rec.onerror = (e: any) => {
      setListening(false)
      if (e.error === 'not-allowed') {
        setError(lang === 'hi' ? 'माइक एक्सेस नहीं मिली।' : 'Microphone access denied.')
      } else if (e.error === 'no-speech') {
        setError(lang === 'hi' ? 'कोई आवाज़ नहीं सुनाई दी।' : 'No speech detected. Try again.')
      } else {
        setError(lang === 'hi' ? 'आवाज़ पहचान में समस्या।' : `Voice error: ${e.error}`)
      }
    }

    recRef.current = rec
    rec.start()
  }

  function stopListening() {
    recRef.current?.stop()
    setListening(false)
  }

  function askSample(q: string) {
    setTranscript(q)
    transcriptRef.current = q
    getAIResponse(q)
  }

  const samples = SAMPLE_QUESTIONS[lang as 'en' | 'hi']

  return (
    <div className="p-5 rounded-xl" style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.14)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "#1a1a14" }}>
            🎙️ {lang === 'hi' ? 'आवाज़ खेती सहायक' : 'Voice Farming Assistant'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#6a6a5a' }}>
            {lang === 'hi' ? 'हिंदी या अंग्रेज़ी में पूछें' : 'Ask in Hindi or English'}
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{
          background: 'rgba(74,222,128,0.1)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.2)'
        }}>
          {lang === 'hi' ? '12+ भाषाएं' : '12+ langs'}
        </span>
      </div>

      {/* Mic button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={listening ? stopListening : startListening}
          className="relative flex items-center justify-center rounded-full transition-all"
          style={{
            width: 72, height: 72,
            background: listening ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.12)',
            border: `2px solid ${listening ? 'rgba(239,68,68,0.5)' : 'rgba(74,222,128,0.3)'}`,
          }}
        >
          <span style={{ fontSize: 28 }}>🎙️</span>
          {listening && (
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(239,68,68,0.15)' }} />
          )}
        </button>
      </div>

      {/* Status text */}
      <p className="text-center text-xs mb-4" style={{
        color: listening ? '#16a34a' : loading ? '#d97706' : '#8a8a7a'
      }}>
        {listening
          ? (lang === 'hi' ? '🎧 सुन रहा हूं...' : '🎧 Listening...')
          : loading
          ? (lang === 'hi' ? '🤖 AI सोच रहा है...' : '🤖 AI is thinking...')
          : (lang === 'hi' ? 'माइक दबाएं और बोलें' : 'Press mic and speak')}
      </p>

      {error && (
        <p className="text-center text-xs mb-3" style={{ color: '#f87171' }}>{error}</p>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="mb-3 p-3 rounded-lg" style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,0,0,0.09)'
        }}>
          <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>
            {lang === 'hi' ? 'आपने कहा:' : 'You said:'}
          </p>
          <p className="text-sm" style={{ color: "#1a1a14" }}>"{transcript}"</p>
        </div>
      )}

      {/* AI Response */}
      {loading && (
        <div className="mb-3 p-3 rounded-lg" style={{
          background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(74,222,128,0.1)' }}>
              <div className="h-full rounded-full animate-pulse" style={{ width: '60%', background: '#4ade80' }} />
            </div>
            <p className="text-xs" style={{ color: 'rgba(22,163,74,0.6)' }}>
              {lang === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...'}
            </p>
          </div>
        </div>
      )}

      {response && !loading && (
        <div className="mb-4 p-3 rounded-lg" style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.18)'
        }}>
          <p className="text-xs font-semibold mb-1.5 text-[#16a34a]">
            🌿 {lang === 'hi' ? 'AI सलाह:' : 'AI Advisory:'}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#2a2a1a' }}>
            {response}
          </p>
          <button
            onClick={() => { setTranscript(''); setResponse(''); transcriptRef.current = '' }}
            className="mt-2 text-xs"
            style={{ color: 'rgba(74,222,128,0.4)' }}
          >
            {lang === 'hi' ? '✕ साफ करें' : '✕ Clear'}
          </button>
        </div>
      )}

      {/* Sample questions */}
      <div>
        <p className="text-xs mb-2" style={{ color: '#8a8a7a' }}>
          {lang === 'hi' ? 'या इन्हें टैप करें:' : 'Or tap a question:'}
        </p>
        <div className="space-y-1.5">
          {samples.map((q, i) => (
            <button key={i} onClick={() => askSample(q)}
              className="w-full text-left text-xs px-3 py-2.5 rounded-lg transition-all hover:border-green-400/25"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(0,0,0,0.09)',
                color: '#4a4a3a',
              }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* SMS fallback */}
      <div className="mt-4 p-3 rounded-xl" style={{
        background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)'
      }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#38bdf8' }}>
          📱 {lang === 'hi' ? 'SMS सलाह (ऑफलाइन क्षेत्र)' : 'SMS Advisory (offline areas)'}
        </p>
        <p className="text-xs" style={{ color: '#6a6a5a' }}>
          {lang === 'hi'
            ? '"CROP TOMATO" लिखकर 1800-XXX-XXXX पर भेजें — हिंदी में जवाब मिलेगा'
            : 'SMS "CROP TOMATO" to 1800-XXX-XXXX — get advice in your language'}
        </p>
      </div>
    </div>
  )
}