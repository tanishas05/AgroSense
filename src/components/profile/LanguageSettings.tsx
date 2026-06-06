'use client'

import { useLang } from '@/context/LanguageContext'

const LANGUAGES = [
  { code: 'en', native: 'English', name: 'English',  ready: true  },
  { code: 'hi', native: 'हिंदी',   name: 'Hindi',    ready: true  },
  { code: 'mr', native: 'मराठी',   name: 'Marathi',  ready: false },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', name: 'Punjabi',  ready: false },
  { code: 'ta', native: 'தமிழ்',  name: 'Tamil',    ready: false },
  { code: 'te', native: 'తెలుగు', name: 'Telugu',   ready: false },
  { code: 'kn', native: 'ಕನ್ನಡ',  name: 'Kannada',  ready: false },
  { code: 'bn', native: 'বাংলা',   name: 'Bengali',  ready: false },
  { code: 'gu', native: 'ગુજરાતી',name: 'Gujarati', ready: false },
  { code: 'or', native: 'ଓଡ଼ିଆ',  name: 'Odia',     ready: false },
  { code: 'ml', native: 'മലയാളം', name: 'Malayalam',ready: false },
  { code: 'ur', native: 'اردو',    name: 'Urdu',     ready: false },
]

export default function LanguageSettings() {
  const { lang, setLang, t } = useLang()

  return (
    <div className="p-6 rounded-2xl h-full flex flex-col"
      style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🌐</span>
        <h2 className="text-sm font-semibold text-white">{t('languagePref')}</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('chooseLanguage')}</p>

      <div className="grid grid-cols-3 gap-2 flex-1">
        {LANGUAGES.map(({ code, native, name, ready }) => {
          const active = lang === code
          return (
            <button key={code}
              onClick={() => ready && setLang(code as any)}
              className="p-3 rounded-xl text-left relative transition-all"
              style={active
                ? { background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)' }
                : ready
                ? { background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', cursor: 'pointer' }
                : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'not-allowed' }}>
              <div className="text-sm font-medium leading-tight"
                style={{ color: active ? '#86efac' : ready ? 'rgba(232,245,226,0.6)' : 'rgba(232,245,226,0.2)' }}>
                {native}
              </div>
              <div className="text-xs mt-0.5"
                style={{ color: active ? 'rgba(74,222,128,0.6)' : 'rgba(232,245,226,0.25)' }}>
                {name}
              </div>
              {!ready && (
                <div className="text-xs mt-0.5" style={{ color: 'rgba(251,191,36,0.4)', fontSize: 9 }}>Soon</div>
              )}
              {active && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#16a34a' }}>
                  <span style={{ fontSize: 8, color: 'white' }}>✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs mt-4" style={{ color: 'rgba(232,245,226,0.2)' }}>
        English and हिंदी are fully supported. Others coming soon.
      </p>
    </div>
  )
}