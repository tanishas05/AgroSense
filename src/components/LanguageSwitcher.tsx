'use client'

import { useLang } from '@/context/LanguageContext'
import { useSession } from 'next-auth/react'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const { data: session } = useSession()

  async function handleSwitch(code: 'en' | 'hi') {
    setLang(code)
    if (session?.user?.email) {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, language: code }),
      })
    }
  }

  return (
    <div className="flex items-center gap-1 bg-green-400/5 border border-green-400/15 rounded-lg p-1">
      {[
        { code: 'en' as const, label: 'EN' },
        { code: 'hi' as const, label: 'हि' },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
          style={{
            backgroundColor: lang === code ? 'rgba(74,222,128,0.2)' : 'transparent',
            color: lang === code ? '#86efac' : 'rgba(232,245,226,0.4)',
            border: lang === code ? '1px solid rgba(74,222,128,0.3)' : '1px solid transparent',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}