import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from './SessionProvider'

export const metadata: Metadata = {
  title: 'AgroSense — AI-Powered Smart Farming',
  description: 'Real-time crop intelligence, hyperlocal weather advisories, and market price predictions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}