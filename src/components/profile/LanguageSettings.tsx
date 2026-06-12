'use client'

import { useLang } from '@/context/LanguageContext'

const LANGUAGES = [
  { code: 'en', native: 'English',   name: 'English',   ready: true  },
  { code: 'hi', native: 'हिंदी',     name: 'Hindi',     ready: true  },
  { code: 'mr', native: 'मराठी',     name: 'Marathi',   ready: false },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',   name: 'Punjabi',   ready: false },
  { code: 'ta', native: 'தமிழ்',    name: 'Tamil',     ready: false },
  { code: 'te', native: 'తెలుగు',   name: 'Telugu',    ready: false },
  { code: 'kn', native: 'ಕನ್ನಡ',    name: 'Kannada',   ready: false },
  { code: 'bn', native: 'বাংলা',     name: 'Bengali',   ready: false },
  { code: 'gu', native: 'ગુજરાતી',  name: 'Gujarati',  ready: false },
  { code: 'or', native: 'ଓଡ଼ିଆ',    name: 'Odia',      ready: false },
  { code: 'ml', native: 'മലയാളം',   name: 'Malayalam', ready: false },
  { code: 'ur', native: 'اردو',      name: 'Urdu',      ready: false },
]

export default function LanguageSettings() {
  const { lang, setLang, t } = useLang()

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-4xl"
            style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>🌐</div>
          <div>
            <h2 className="text-4xl font-semibold" style={{ color: '#111111' }}>{t('languagePref')}</h2>
            <p className="text-4xl" style={{ color: '#8a8a7a' }}>{t('chooseLanguage')}</p>
          </div>
        </div>
        <span className="text-4xl px-2 py-1 rounded-lg" style={{ background: 'rgba(74,222,128,0.08)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.15)' }}>
          {lang === 'en' ? 'English' : 'हिंदी'} active
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-2.5">
          {LANGUAGES.map(({ code, native, name, ready }) => {
            const active = lang === code
            return (
              <button key={code}
                onClick={() => ready && setLang(code as any)}
                className="p-3 rounded-xl text-left relative transition-all"
                style={
                  active
                    ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.4)', cursor: 'pointer' }
                    : ready
                    ? { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer' }
                    : { background: 'transparent', border: '1px solid rgba(255,255,255,0.03)', cursor: 'not-allowed', opacity: 0.5 }
                }
                onMouseEnter={e => ready && !active && (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)')}
                onMouseLeave={e => ready && !active && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                
                {/* Active checkmark */}
                {active && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#16a34a' }}>
                    <span style={{ fontSize: 8, color: '#1a1a1a', fontWeight: 700 }}>✓</span>
                  </div>
                )}

                <div className="text-4xl font-medium leading-tight mb-0.5"
                  style={{ color: active ? '#16a34a' : ready ? '#1a1a14' : '#b0b0a0' }}>
                  {native}
                </div>
                <div className="text-4xl"
                  style={{ color: active ? '#16a34a' : '#8a8a7a' }}>
                  {name}
                </div>
                {!ready && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-4xl"
                    style={{ background: 'rgba(251,191,36,0.08)', color: 'rgba(251,191,36,0.5)', fontSize: 9, border: '1px solid rgba(251,191,36,0.12)' }}>
                    Soon
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 text-4xl px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.1)', color: 'rgba(56,189,248,0.6)' }}>
          <span>ℹ️</span>
          English and हिंदी are fully supported. 10 more languages coming soon.
        </div>
      </div>
    </div>
  )
}