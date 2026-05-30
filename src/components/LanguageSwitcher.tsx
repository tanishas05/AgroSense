'use client'

import { createElement, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import i18n from '@/lib/i18n'

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'हिंदी' },
]

export default function LanguageSwitcher() {
  const { data: session } = useSession()
  const [current, setCurrent] = useState('en')

  // Load saved language from profile
  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        const lang = data?.language ?? 'en'
        const supported = ['en', 'hi'].includes(lang) ? lang : 'en'
        setCurrent(supported)
        i18n.changeLanguage(supported)
      })
  }, [session])

  async function switchLanguage(code: string) {
    setCurrent(code)
    i18n.changeLanguage(code)
    // Save to profile
    if (session?.user?.email) {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, language: code }),
      })
    }
  }

  return createElement(
    'div',
    { className: 'flex items-center gap-1 bg-green-400/5 border border-green-400/15 rounded-lg p-1' },
    ...LANGUAGES.map(({ code, label, name }) =>
      createElement(
        'button',
        {
          key: code,
          onClick: () => switchLanguage(code),
          title: name,
          className: `px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
            current === code
              ? 'bg-green-400/20 text-green-300 border border-green-400/30'
              : 'text-green-100/40 hover:text-green-300'
          }`,
        },
        label,
      ),
    ),
  )
}