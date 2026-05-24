'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
]

export default function LanguageSettings() {
  const { data: session } = useSession()
  const [selected, setSelected] = useState('en')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data?.language) setSelected(data.language)
        setLoading(false)
      })
  }, [session])

  async function handleSave() {
    if (!session?.user?.email) return
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, language: selected }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-48 animate-pulse" />

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-green-100 mb-1">Language Preference</h2>
      <p className="text-xs text-green-100/35 mb-4">Choose your preferred language for advisories and alerts</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {languages.map(({ code, name, native }) => (
          <button
            key={code}
            onClick={() => setSelected(code)}
            className={`p-3 rounded-lg border text-left transition-all ${
              selected === code
                ? 'bg-green-400/15 border-green-400/40 text-green-300'
                : 'bg-green-400/3 border-green-400/10 text-green-100/50 hover:border-green-400/25'
            }`}
          >
            <div className="text-sm font-medium">{native}</div>
            <div className="text-[10px] mt-0.5 opacity-60">{name}</div>
          </button>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="w-full py-2.5 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all"
      >
        {saved ? '✓ Language Saved!' : 'Save Language'}
      </button>
    </div>
  )
}