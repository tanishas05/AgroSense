'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const CROPS = [
  // Cereals
  'Wheat', 'Rice', 'Maize', 'Barley', 'Sorghum', 'Millet', 'Oats',
  // Vegetables
  'Tomato', 'Potato', 'Onion', 'Garlic', 'Brinjal', 'Capsicum',
  'Cauliflower', 'Cabbage', 'Spinach', 'Okra', 'Peas', 'Carrot',
  'Radish', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin', 'Cucumber', 'Lettuce',
  // Cash Crops
  'Cotton', 'Sugarcane', 'Jute', 'Tobacco', 'Rubber',
  // Oilseeds
  'Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Sesame', 'Linseed', 'Castor',
  // Pulses
  'Chickpea', 'Lentil', 'Moong Bean', 'Urad Dal', 'Pigeon Pea', 'Kidney Bean', 'Horse Gram',
  // Fruits
  'Mango', 'Banana', 'Papaya', 'Guava', 'Pomegranate', 'Grapes',
  'Lemon', 'Orange', 'Watermelon', 'Muskmelon', 'Apple', 'Strawberry',
  // Spices
  'Turmeric', 'Ginger', 'Chilli', 'Coriander', 'Cumin', 'Fenugreek', 'Cardamom', 'Pepper',
]

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
]

const SOIL_TYPES = [
  'Black Soil (Regur)',
  'Red Soil',
  'Alluvial Soil',
  'Sandy Soil',
  'Clay Soil',
  'Loamy Soil',
  'Laterite Soil',
  'Peaty Soil',
  'Saline Soil',
  'Chalky Soil',
  'Silty Soil',
  'Sandy Loam',
  'Clay Loam',
  'Silt Loam',
  'Rocky Soil',
  'Forest Soil',
  'Desert Soil',
]

const CROP_CATEGORIES = [
  { label: 'Cereals', crops: ['Wheat', 'Rice', 'Maize', 'Barley', 'Sorghum', 'Millet', 'Oats'] },
  { label: 'Vegetables', crops: ['Tomato', 'Potato', 'Onion', 'Garlic', 'Brinjal', 'Capsicum', 'Cauliflower', 'Cabbage', 'Spinach', 'Okra', 'Peas', 'Carrot', 'Radish', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin', 'Cucumber', 'Lettuce'] },
  { label: 'Cash Crops', crops: ['Cotton', 'Sugarcane', 'Jute', 'Tobacco', 'Rubber'] },
  { label: 'Oilseeds', crops: ['Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Sesame', 'Linseed', 'Castor'] },
  { label: 'Pulses', crops: ['Chickpea', 'Lentil', 'Moong Bean', 'Urad Dal', 'Pigeon Pea', 'Kidney Bean', 'Horse Gram'] },
  { label: 'Fruits', crops: ['Mango', 'Banana', 'Papaya', 'Guava', 'Pomegranate', 'Grapes', 'Lemon', 'Orange', 'Watermelon', 'Muskmelon', 'Apple', 'Strawberry'] },
  { label: 'Spices', crops: ['Turmeric', 'Ginger', 'Chilli', 'Coriander', 'Cumin', 'Fenugreek', 'Cardamom', 'Pepper'] },
]

export default function FarmSettings() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    farm_name: 'My Farm',
    state: 'Maharashtra',
    district: '',
    land_size: '5',
    soil_type: 'Black Soil (Regur)',
    crops: [] as string[],
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Cereals')

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          setForm({
            farm_name: data.farm_name ?? 'My Farm',
            state: data.state ?? 'Maharashtra',
            district: data.district ?? '',
            land_size: data.land_size ?? '5',
            soil_type: data.soil_type ?? 'Black Soil (Regur)',
            crops: data.crops ?? [],
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
            placeholder="Enter your district"
            className="w-full text-xs px-3 py-2 bg-green-400/5 border border-green-400/15 rounded-lg text-green-100 outline-none focus:border-green-400/40 placeholder-green-100/20"
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

      {/* Crops section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] text-green-100/40">Crops You Grow</label>
          {form.crops.length > 0 && (
            <span className="text-[10px] text-green-400">{form.crops.length} selected</span>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {CROP_CATEGORIES.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-all ${
                activeCategory === label
                  ? 'bg-green-400/20 text-green-300 border border-green-400/30'
                  : 'text-green-100/30 border border-green-400/10 hover:text-green-100/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Crops for active category */}
        <div className="flex flex-wrap gap-2">
          {CROP_CATEGORIES.find(c => c.label === activeCategory)?.crops.map(crop => (
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

        {/* Selected crops summary */}
        {form.crops.length > 0 && (
          <div className="mt-3 p-2.5 bg-green-400/5 border border-green-400/10 rounded-lg">
            <p className="text-[10px] text-green-100/40 mb-1.5">Selected crops:</p>
            <div className="flex flex-wrap gap-1.5">
              {form.crops.map(crop => (
                <span
                  key={crop}
                  onClick={() => toggleCrop(crop)}
                  className="text-[10px] px-2 py-0.5 bg-green-400/15 text-green-300 rounded border border-green-400/25 cursor-pointer hover:bg-red-400/15 hover:text-red-300 hover:border-red-400/25 transition-all"
                >
                  {crop} ×
                </span>
              ))}
            </div>
          </div>
        )}
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