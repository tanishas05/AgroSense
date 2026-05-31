'use client'

import { useLang } from '../../context/LanguageContext'

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
  const { lang, setLang, t } = useLang()

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-green-100 mb-1">{t('languagePref')}</h2>
      <p className="text-xs text-green-100/35 mb-4">{t('chooseLanguage')}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {languages.map(({ code, name, native }) => (
          <button key={code} onClick={() => setLang(code as any)}
            className="p-3 rounded-lg border text-left transition-all"
            style={lang === code
              ? { background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.4)', color: '#86efac' }
              : { background: 'rgba(74,222,128,0.03)', borderColor: 'rgba(74,222,128,0.1)', color: 'rgba(232,245,226,0.4)' }
            }>
            <div className="text-sm font-medium">{native}</div>
            <div className="text-xs mt-0.5 opacity-60">{name}</div>
            {code !== 'en' && code !== 'hi' && <div className="text-xs mt-0.5" style={{ color: '#fbbf24' }}>Coming soon</div>}
          </button>
        ))}
      </div>
      <p className="text-xs text-green-100/25">English and हिंदी are fully supported. Other languages coming soon.</p>
    </div>
  )
}