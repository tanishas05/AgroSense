import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getOrCreateProfile, updateProfile, getUserStats } from '@/lib/db'

const ALLOWED_UPDATE_FIELDS = [
  'farm_name',
  'land_size',
  'state',
  'district',
  'soil_type',
  'soil_types',
  'crops',
  'language',
  'notifications',
]

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  // Users can only read their own profile
  if (email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [profile, stats] = await Promise.all([
    getOrCreateProfile(email),
    getUserStats(email),
  ])

  return NextResponse.json({ ...profile, stats })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { email, ...rawUpdates } = body
  if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

  // Users can only update their own profile
  if (email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Whitelist fields — never allow arbitrary column writes
  const updates = Object.fromEntries(
    Object.entries(rawUpdates).filter(([key]) => ALLOWED_UPDATE_FIELDS.includes(key))
  )

  const profile = await updateProfile(email, updates)
  return NextResponse.json(profile)
}