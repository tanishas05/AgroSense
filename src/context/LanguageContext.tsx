'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, Lang, TranslationKey } from '@/lib/i18n'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations.en[key],
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  // Restore language from localStorage on first load (instant, no flash)
  useEffect(() => {
    const saved = localStorage.getItem('agrosense_lang')
    if (saved === 'en' || saved === 'hi') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('agrosense_lang', l)
  }

  function t(key: TranslationKey): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}