import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateProfile, updateProfile, getUserStats } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  const [profile, stats] = await Promise.all([
    getOrCreateProfile(email),
    getUserStats(email),
  ])

  return NextResponse.json({ ...profile, stats })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, ...updates } = body
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  const profile = await updateProfile(email, updates)
  return NextResponse.json(profile)
}