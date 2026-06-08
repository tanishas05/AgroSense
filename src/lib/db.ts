import { supabase } from './supabase'

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

export async function updateProfile(email: string, updates: any) {
  const { data } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('email', email)
    .select()
    .single()
  return data
}

export async function saveScan(email: string, scan: any) {
  const { data } = await supabase
    .from('disease_scans')
    .insert({ user_email: email, ...scan })
    .select()
    .single()
  return data
}

export async function getUserScans(email: string) {
  const { data } = await supabase
    .from('disease_scans')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(10)
  return data ?? []
}

export async function saveAlert(email: string, alert: any) {
  const { data } = await supabase
    .from('farm_alerts')
    .insert({ user_email: email, ...alert })
    .select()
    .single()
  return data
}

export async function getUserAlerts(email: string) {
  const { data } = await supabase
    .from('farm_alerts')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })
    .limit(20)
  return data ?? []
}

export async function markAlertRead(id: string) {
  await supabase
    .from('farm_alerts')
    .update({ is_read: true })
    .eq('id', id)
}

export async function getUserStats(email: string) {
  const [scans, alerts] = await Promise.all([
    supabase.from('disease_scans').select('id', { count: 'exact' }).eq('user_email', email),
    supabase.from('farm_alerts').select('id', { count: 'exact' }).eq('user_email', email).eq('is_read', false),
  ])
  return {
    scans: scans.count ?? 0,
    alerts: alerts.count ?? 0,
  }
}