'use client'

import { useLang } from '@/context/LanguageContext'

const languages = [
  { code: 'en', name: 'English', native: 'English', ready: true },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', ready: true },
  { code: 'mr', name: 'Marathi', native: 'मराठी', ready: false },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', ready: false },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', ready: false },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', ready: false },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', ready: false },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', ready: false },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', ready: false },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', ready: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', ready: false },
  { code: 'ur', name: 'Urdu', native: 'اردو', ready: false },
]

export default function LanguageSettings() {
  const { lang, setLang, t } = useLang()

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🌐</span>
        <h2 className="text-sm font-semibold text-white">{t('languagePref')}</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('chooseLanguage')}</p>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {languages.map(({ code, name, native, ready }) => (
          <button key={code}
            onClick={() => ready && setLang(code as any)}
            className="p-3 rounded-xl text-left transition-all relative"
            style={lang === code
              ? { background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', color: '#86efac' }
              : ready
              ? { background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', color: 'rgba(232,245,226,0.6)', cursor: 'pointer' }
              : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(232,245,226,0.2)', cursor: 'not-allowed' }}>
            <div className="text-sm font-medium leading-tight">{native}</div>
            <div className="text-xs mt-0.5" style={{ opacity: 0.6 }}>{name}</div>
            {!ready && (
              <div className="text-xs mt-1" style={{ color: 'rgba(251,191,36,0.5)', fontSize: 9 }}>Soon</div>
            )}
            {lang === code && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: '#16a34a' }}>
                <span style={{ fontSize: 8, color: 'white' }}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs" style={{ color: 'rgba(232,245,226,0.2)' }}>
        English and हिंदी are fully supported. Other languages coming soon.
      </p>
    </div>
  )
}