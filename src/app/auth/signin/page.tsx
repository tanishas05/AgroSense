'use client'

import { signIn } from 'next-auth/react'
import { useLang } from '../../context/LanguageContext'

export default function SignInPage() {
  const { t } = useLang()

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0a1a0d' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)', top: -120, right: -120 }} />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9 2C9 2 5 5 5 9C5 11.2 6.8 13 9 13C11.2 13 13 11.2 13 9C13 5 9 2 9 2Z" fill="white" opacity="0.9"/>
              <path d="M9 13V16M7 16H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-green-300 font-bold text-xl tracking-tight">AgroSense</span>
        </div>

        <div className="bg-green-950/80 border border-green-400/20 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="font-serif text-3xl text-green-50 mb-1 text-center">{t('welcomeBack')}</h1>
          <p className="text-sm text-green-100/40 text-center mb-8">{t('signInAccess')}</p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl transition-all hover:-translate-y-0.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('continueWithGoogle')}
          </button>

          <p className="text-xs text-green-100/25 text-center mt-6 leading-relaxed">{t('termsText')}</p>
        </div>

        <p className="text-center text-xs text-green-100/25 mt-6">
          {t('newToAgroSense')}{' '}
          <span className="text-green-400 cursor-pointer hover:underline" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            {t('createFreeAccount')}
          </span>
        </p>
      </div>
    </main>
  )
}