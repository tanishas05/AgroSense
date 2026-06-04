'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

// ─── useOffline hook ──────────────────────────────────────────────────────────
// Drop this anywhere: const { isOffline, lastSync } = useOffline()
export function useOffline() {
  const [isOffline, setIsOffline] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    setIsOffline(!navigator.onLine)
    if (navigator.onLine) setLastSync(new Date())

    function onOnline() {
      setIsOffline(false)
      setLastSync(new Date())
      // Cache key data for offline use
      cacheEssentialData()
    }
    function onOffline() { setIsOffline(true) }

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  return { isOffline, lastSync }
}

// Cache weather + mandi + profile data in localStorage for offline
async function cacheEssentialData() {
  try {
    const [weather, mandi] = await Promise.all([
      fetch('/api/weather?q=Delhi&type=current').then(r => r.json()),
      fetch('/api/mandi').then(r => r.json()),
    ])
    localStorage.setItem('agro_cache_weather', JSON.stringify({ data: weather, ts: Date.now() }))
    localStorage.setItem('agro_cache_mandi', JSON.stringify({ data: mandi, ts: Date.now() }))
  } catch {}
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`agro_cache_${key}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Cache valid for 6 hours
    if (Date.now() - parsed.ts > 6 * 60 * 60 * 1000) return null
    return parsed.data as T
  } catch { return null }
}

// ─── Offline Banner component ─────────────────────────────────────────────────
export default function OfflineBanner() {
  const { isOffline, lastSync } = useOffline()
  const { lang } = useLang()

  if (!isOffline) return null

  const timeAgo = lastSync
    ? Math.round((Date.now() - lastSync.getTime()) / 60000)
    : null

  const msg = lang === 'hi'
    ? `📶 ऑफलाइन मोड — कैश्ड डेटा${timeAgo ? ` · अंतिम सिंक: ${timeAgo} मिनट पहले` : ''} · SMS सलाह उपलब्ध है`
    : `📶 Offline mode — showing cached data${timeAgo ? ` · Last sync: ${timeAgo}m ago` : ''} · SMS advisory available`

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-xl"
      style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
      <span className="text-xs font-medium" style={{ color: '#fde047' }}>{msg}</span>
    </div>
  )
}