'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Maize', 'Cotton', 'Soybean', 'Potato', 'Sugarcane', 'Mustard']
const STATES = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu']
const SOIL_TYPES = ['Black Soil', 'Red Soil', 'Alluvial Soil', 'Sandy Soil', 'Clay Soil', 'Loamy Soil']

export default function FarmSettings() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    farm_name: 'My Farm',
    state: 'Maharashtra',
    district: 'Nashik',
    land_size: '5',
    soil_type: 'Black Soil',
    crops: ['Wheat'],
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          setForm({
            farm_name: data.farm_name ?? 'My Farm',
            state: data.state ?? 'Maharashtra',
            district: data.district ?? 'Nashik',
            land_size: data.land_size ?? '5',
            soil_type: data.soil_type ?? 'Black Soil',
            crops: data.crops ?? ['Wheat'],
          })
        }
        setLoading(false)
      })
  }, [session])

  function toggleCrop(crop: string) {
    setForm(f => ({
      ...f,
      crops: f.crops.includes(crop)
        ? f.crops.filter(c => c !== crop)
        : [...f.crops, crop],
    }))
  }

  async function handleSave() {
    if (!session?.user?.email) return
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, ...form }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5 h-48 animate-pulse" />

  return (
    <div className="bg-green-950/60 border border-green-400/15 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-green-100 mb-4">Farm Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[10px] text-green-100/40 mb-1 block">Farm Name</label>
          <input
            value={form.farm_name}
            onChange={e => setForm(f => ({ ...f, farm_name: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 outline-none focus:border-green-400/40"
          />
        </div>
        <div>
          <label className="text-[10px] text-green-100/40 mb-1 block">Land Size (acres)</label>
          <input
            type="number"
            value={form.land_size}
            onChange={e => setForm(f => ({ ...f, land_size: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 outline-none focus:border-green-400/40"
          />
        </div>
        <div>
          <label className="text-[10px] text-green-100/40 mb-1 block">State</label>
          <select
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 outline-none focus:border-green-400/40"
          >
            {STATES.map(s => <option key={s} value={s} className="bg-green-950">{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-green-100/40 mb-1 block">District</label>
          <input
            value={form.district}
            onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 outline-none focus:border-green-400/40"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] text-green-100/40 mb-1 block">Soil Type</label>
          <select
            value={form.soil_type}
            onChange={e => setForm(f => ({ ...f, soil_type: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 outline-none focus:border-green-400/40"
          >
            {SOIL_TYPES.map(s => <option key={s} value={s} className="bg-green-950">{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[10px] text-green-100/40 mb-2 block">Crops You Grow</label>
        <div className="flex flex-wrap gap-2">
          {CROPS.map(crop => (
            <button
              key={crop}
              onClick={() => toggleCrop(crop)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                form.crops.includes(crop)
                  ? 'bg-green-400/20 text-green-300 border-green-400/40'
                  : 'text-green-100/40 border-green-400/10 hover:border-green-400/25'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2.5 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all"
      >
        {saved ? '✓ Saved!' : 'Save Farm Settings'}
      </button>
    </div>
  )
}