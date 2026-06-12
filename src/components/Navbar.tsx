'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: t('features'),  href: '/features' },
    { label: t('market'),    href: '/market' },
    { label: t('advisory'),  href: '/advisory' },
  ]

  function closeMenu() { setOpen(false) }

  return (
    <>
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

        {/* Desktop nav links — centered */}
        <div className="hidden md:flex items-center gap-7 text-sm absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ label, href }) => (
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

        {/* Right — desktop */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <LanguageSwitcher />

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#8a8a7a' }}>{session.user?.name}</span>
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

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded-lg transition-all"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: open ? 'rgba(22,163,74,0.08)' : 'transparent' }}>
            <span className="block w-5 h-px transition-all duration-200"
              style={{ background: '#4a4a3a', transform: open ? 'translateY(4px) rotate(45deg)' : 'none' }} />
            <span className="block w-5 h-px transition-all duration-200"
              style={{ background: '#4a4a3a', opacity: open ? 0 : 1 }} />
            <span className="block w-5 h-px transition-all duration-200"
              style={{ background: '#4a4a3a', transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex flex-col"
          style={{ background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>

          {/* Drawer top bar */}
          <div className="flex items-center justify-between px-8 py-4"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <span className="font-bold text-base tracking-tight" style={{ color: '#1a1a14' }}>AgroSense</span>
            <button onClick={closeMenu} className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(0,0,0,0.05)' }}
              aria-label="Close menu">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="#4a4a3a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col px-8 py-6 gap-1 flex-1">
            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href} onClick={closeMenu}
                className="no-underline py-3.5 text-base font-medium transition-colors"
                style={{ color: '#2a2a1a', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {label}
              </Link>
            ))}
            <button onClick={() => { closeMenu(); session ? router.push('/dashboard') : router.push('/auth/signin') }}
              className="text-left py-3.5 text-base font-medium transition-colors"
              style={{ color: '#2a2a1a', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              {t('dashboard')}
            </button>

            {/* Mobile auth */}
            <div className="mt-6 flex flex-col gap-3">
              {session ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    {session.user?.image
                      ? <img src={session.user.image} alt="avatar" className="w-9 h-9 rounded-full" style={{ border: '2px solid rgba(22,163,74,0.3)' }} />
                      : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid rgba(22,163,74,0.3)', color: '#16a34a' }}>👤</div>
                    }
                    <span className="text-sm" style={{ color: '#4a4a3a' }}>{session.user?.name}</span>
                  </div>
                  <button onClick={() => { closeMenu(); router.push('/profile') }}
                    className="w-full py-3 text-sm rounded-xl text-left px-4"
                    style={{ background: 'rgba(0,0,0,0.04)', color: '#4a4a3a', border: '1px solid rgba(0,0,0,0.08)' }}>
                    {'Profile'}
                  </button>
                  <button onClick={() => { closeMenu(); signOut() }}
                    className="w-full py-3 text-sm rounded-xl font-medium"
                    style={{ color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.05)' }}>
                    {t('signOut')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { closeMenu(); signIn('google') }}
                    className="w-full py-3 text-sm rounded-xl font-semibold"
                    style={{ background: '#16a34a', color: 'white' }}>
                    {t('getStarted')}
                  </button>
                  <button onClick={() => { closeMenu(); signIn('google') }}
                    className="w-full py-3 text-sm rounded-xl"
                    style={{ color: '#4a4a3a', border: '1px solid rgba(0,0,0,0.12)', background: 'transparent' }}>
                    {t('signIn')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}