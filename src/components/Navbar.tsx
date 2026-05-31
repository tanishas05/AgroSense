'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useLang()

  return (
    <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-green-400/10">
      <Link href="/" className="flex items-center gap-2.5 text-green-300 font-bold text-lg tracking-tight no-underline">
        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C9 2 5 5 5 9C5 11.2 6.8 13 9 13C11.2 13 13 11.2 13 9C13 5 9 2 9 2Z" fill="white" opacity="0.9"/>
            <path d="M9 13V16M7 16H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        AgroSense
      </Link>

      <div className="hidden md:flex items-center gap-7 text-sm text-green-100/40">
        <Link href="/features" className="hover:text-green-300 transition-colors no-underline">{t('features')}</Link>
        <button onClick={() => session ? router.push('/dashboard') : router.push('/auth/signin')} className="hover:text-green-300 transition-colors">
          {t('dashboard')}
        </button>
        <Link href="/market" className="hover:text-green-300 transition-colors no-underline">{t('market')}</Link>
        <Link href="/advisory" className="hover:text-green-300 transition-colors no-underline">{t('advisory')}</Link>
      </div>

      <div className="flex items-center gap-2.5">
        <LanguageSwitcher />
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-green-100/40 hidden md:block">{session.user?.name}</span>
            <Link href="/profile">
              {session.user?.image ? (
                <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full border border-green-400/30 hover:border-green-400/60 transition-all cursor-pointer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center text-xs text-green-400 cursor-pointer">👤</div>
              )}
            </Link>
            <button onClick={() => signOut()} className="px-4 py-1.5 text-sm text-green-300 border border-green-400/30 rounded-md hover:bg-green-400/8 transition-all">
              {t('signOut')}
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => signIn('google')} className="px-4 py-1.5 text-sm text-green-300 border border-green-400/30 rounded-md hover:bg-green-400/8 transition-all">
              {t('signIn')}
            </button>
            <button onClick={() => signIn('google')} className="px-4 py-1.5 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 transition-all">
              {t('getStarted')}
            </button>
          </>
        )}
      </div>
    </nav>
  )
}