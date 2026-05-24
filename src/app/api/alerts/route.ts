import { NextRequest, NextResponse } from 'next/server'
import { getUserAlerts, saveAlert, markAlertRead } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json([])
  const alerts = await getUserAlerts(email)
  return NextResponse.json(alerts)
}

export async function POST(req: NextRequest) {
  const { email, ...alert } = await req.json()
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })
  const data = await saveAlert(email, alert)
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { id } = await req.json()
  await markAlertRead(id)
  return NextResponse.json({ success: true })
}