import { supabase } from './supabase'

// Get or create user profile
export async function getOrCreateProfile(email: string, name?: string, avatar?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (data) return data

  const { data: newProfile } = await supabase
    .from('profiles')
    .insert({ email, name, avatar_url: avatar })
    .select()
    .single()

  return newProfile
}

// Update profile
export async function updateProfile(email: string, updates: any) {
  const { data } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('email', email)
    .select()
    .single()
  return data
}

// Save disease scan
export async function saveScan(email: string, scan: any) {
  const { data } = await supabase
    .from('disease_scans')
    .insert({ user_email: email, ...scan })
    .select()
    .single()
  return data
}

// Get user scans
export async function getUserScans(email: string) {
  const { data } = await supabase
    .from('disease_scans')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(10)
  return data ?? []
}

// Save alert
export async function saveAlert(email: string, alert: any) {
  const { data } = await supabase
    .from('farm_alerts')
    .insert({ user_email: email, ...alert })
    .select()
    .single()
  return data
}

// Get user alerts
export async function getUserAlerts(email: string) {
  const { data } = await supabase
    .from('farm_alerts')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(20)
  return data ?? []
}

// Mark alert as read
export async function markAlertRead(id: string) {
  await supabase
    .from('farm_alerts')
    .update({ is_read: true })
    .eq('id', id)
}

// Get user stats
export async function getUserStats(email: string) {
  const [scans, alerts] = await Promise.all([
    supabase.from('disease_scans').select('id', { count: 'exact' }).eq('user_email', email),
    supabase.from('farm_alerts').select('id', { count: 'exact' }).eq('user_email', email),
  ])
  return {
    scans: scans.count ?? 0,
    alerts: alerts.count ?? 0,
  }
}