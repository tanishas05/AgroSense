import { NextRequest, NextResponse } from 'next/server'
import { saveScan, getUserScans } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json([])
  const scans = await getUserScans(email)
  return NextResponse.json(scans)
}

export async function POST(req: NextRequest) {
  const { email, ...scan } = await req.json()
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })
  const data = await saveScan(email, scan)
  return NextResponse.json(data)
}