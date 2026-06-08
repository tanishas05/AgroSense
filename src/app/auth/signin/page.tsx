'use client'

import { signIn } from 'next-auth/react'
import { useLang } from '@/context/LanguageContext'

export default function SignInPage() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f0e8' }}>
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9 2C9 2 5 5 5 9C5 11.2 6.8 13 9 13C11.2 13 13 11.2 13 9C13 5 9 2 9 2Z" fill="white" opacity="0.9"/>
              <path d="M9 13V16M7 16H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight" style={{ color: '#1a1a14' }}>AgroSense</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
          <h1 className="font-serif text-3xl mb-1 text-center" style={{ color: '#1a1a14' }}>{t('welcomeBack')}</h1>
          <p className="text-sm text-center mb-8" style={{ color: '#8a8a7a' }}>{t('signInAccess')}</p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 font-medium text-sm rounded-xl transition-all"
            style={{ background: 'white', color: '#1a1a14', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('continueWithGoogle')}
          </button>

          <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: '#b0b0a0' }}>{t('termsText')}</p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#8a8a7a' }}>
          {t('newToAgroSense')}{' '}
          <span className="cursor-pointer hover:underline" style={{ color: '#16a34a' }}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            {t('createFreeAccount')}
          </span>
        </p>
      </div>
    </main>
  )
}