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
    <nav style={{
      background: 'rgba(245,240,232,0.85)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }} className="relative z-20 flex items-center justify-between px-8 py-4">

      {/* Logo */}
      <Link href="/" className="flex items-center no-underline flex-shrink-0">
        <span className="font-bold text-base tracking-tight" style={{ color: '#1a1a14' }}>AgroSense</span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7 text-sm absolute left-1/2 -translate-x-1/2">
        {[
          { label: t('features'),  href: '/features' },
          { label: t('market'),    href: '/market' },
          { label: t('advisory'),  href: '/advisory' },
        ].map(({ label, href }) => (
          <Link key={href} href={href}
            className="no-underline transition-colors"
            style={{ color: '#4a4a3a' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#16a34a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a4a3a')}>
            {label}
          </Link>
        ))}
        <button
          onClick={() => session ? router.push('/dashboard') : router.push('/auth/signin')}
          className="transition-colors text-sm"
          style={{ color: '#4a4a3a' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#16a34a')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4a4a3a')}>
          {t('dashboard')}
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <LanguageSwitcher />
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-xs hidden md:block" style={{ color: '#8a8a7a' }}>{session.user?.name}</span>
            <Link href="/profile">
              {session.user?.image ? (
                <img src={session.user.image} alt="avatar"
                  className="w-8 h-8 rounded-full cursor-pointer transition-all"
                  style={{ border: '2px solid rgba(22,163,74,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(22,163,74,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(22,163,74,0.3)')} />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer"
                  style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid rgba(22,163,74,0.3)', color: '#16a34a' }}>👤</div>
              )}
            </Link>
            <button onClick={() => signOut()}
              className="px-3 py-1.5 text-sm rounded-lg transition-all"
              style={{ color: '#4a4a3a', border: '1px solid rgba(0,0,0,0.12)', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(22,163,74,0.4)'; e.currentTarget.style.color = '#16a34a' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#4a4a3a' }}>
              {t('signOut')}
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => signIn('google')}
              className="px-3 py-1.5 text-sm rounded-lg transition-all"
              style={{ color: '#4a4a3a', border: '1px solid rgba(0,0,0,0.12)', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(22,163,74,0.4)'; e.currentTarget.style.color = '#16a34a' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#4a4a3a' }}>
              {t('signIn')}
            </button>
            <button onClick={() => signIn('google')}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg transition-all"
              style={{ background: '#16a34a', color: 'white', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}>
              {t('getStarted')}
            </button>
          </>
        )}
      </div>
    </nav>
  )
}