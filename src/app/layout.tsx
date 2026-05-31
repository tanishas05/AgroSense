import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from './SessionProvider'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: 'AgroSense — AI-Powered Smart Farming',
  description: 'Real-time crop intelligence, hyperlocal weather advisories, and market price predictions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}