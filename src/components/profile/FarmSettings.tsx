'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry']
const SOIL_TYPES = ['Black Soil (Regur)','Red Soil','Alluvial Soil','Sandy Soil','Clay Soil','Loamy Soil','Laterite Soil','Peaty Soil','Saline Soil','Sandy Loam','Clay Loam','Silt Loam','Rocky Soil','Forest Soil','Desert Soil','Silty Soil']
const CROP_CATEGORIES = [
  { label: 'Cereals',    icon: '🌾', crops: ['Wheat','Rice','Maize','Barley','Sorghum','Millet','Oats','Ragi','Bajra','Jowar'] },
  { label: 'Vegetables', icon: '🥦', crops: ['Tomato','Potato','Onion','Garlic','Brinjal','Capsicum','Cauliflower','Cabbage','Spinach','Okra','Peas','Carrot','Radish','Bitter Gourd','Bottle Gourd','Pumpkin','Cucumber','Beetroot','Sweet Potato','Drumstick'] },
  { label: 'Cash Crops', icon: '💰', crops: ['Cotton','Sugarcane','Jute','Tobacco','Rubber','Hemp'] },
  { label: 'Oilseeds',   icon: '🌻', crops: ['Soybean','Groundnut','Mustard','Sunflower','Sesame','Linseed','Castor','Safflower'] },
  { label: 'Pulses',     icon: '🫘', crops: ['Chickpea','Lentil','Moong Bean','Urad Dal','Pigeon Pea','Kidney Bean','Horse Gram','Cowpea','Field Pea'] },
  { label: 'Fruits',     icon: '🍎', crops: ['Mango','Banana','Papaya','Guava','Pomegranate','Grapes','Lemon','Orange','Watermelon','Apple','Strawberry','Pineapple','Litchi','Coconut'] },
  { label: 'Spices',     icon: '🌶️', crops: ['Turmeric','Ginger','Chilli','Coriander','Cumin','Fenugreek','Cardamom','Pepper','Clove','Fennel'] },
  { label: 'Flowers',    icon: '🌸', crops: ['Rose','Marigold','Jasmine','Chrysanthemum','Tuberose','Gladiolus','Lotus','Gerbera'] },
  { label: 'Plantation', icon: '🌴', crops: ['Tea','Coffee','Arecanut','Cashew','Cocoa','Vanilla'] },
]

export default function FarmSettings() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [form, setForm] = useState({ farm_name: 'My Farm', state: 'Maharashtra', district: '', land_size: '5', soil_types: [] as string[], crops: [] as string[] })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Cereals')
  const [cropSearch, setCropSearch] = useState('')

  useEffect(() => {
    if (!session?.user?.email) return
    fetch(`/api/profile?email=${session.user.email}`).then(r => r.json()).then(data => {
      if (data) setForm({
        farm_name: data.farm_name ?? 'My Farm',
        state: data.state ?? 'Maharashtra',
        district: data.district ?? '',
        land_size: data.land_size ?? '5',
        soil_types: data.soil_types ?? (data.soil_type ? [data.soil_type] : []),
        crops: data.crops ?? [],
      })
      setLoading(false)
    })
  }, [session])

  function toggleSoil(soil: string) {
    setForm(f => ({ ...f, soil_types: f.soil_types.includes(soil) ? f.soil_types.filter(s => s !== soil) : [...f.soil_types, soil] }))
  }
  function toggleCrop(crop: string) {
    setForm(f => ({ ...f, crops: f.crops.includes(crop) ? f.crops.filter(c => c !== crop) : [...f.crops, crop] }))
  }

  async function handleSave() {
    if (!session?.user?.email) return
    await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: session.user.email, ...form, soil_type: form.soil_types[0] ?? '' }) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const activeCrops = cropSearch
    ? CROP_CATEGORIES.flatMap(c => c.crops).filter(c => c.toLowerCase().includes(cropSearch.toLowerCase())).slice(0, 20)
    : (CROP_CATEGORIES.find(c => c.label === activeCategory)?.crops ?? [])

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(74,222,128,0.1)',
    color: '#1a1a1a',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  if (loading) return (
    <div className="rounded-2xl animate-pulse" style={{ height: 400, background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} />
  )

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-4xl"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>🏡</div>
          <div>
            <h2 className="text-4xl font-semibold" style={{ color: '#111111' }}>{t('farmDetails')}</h2>
            <p className="text-4xl" style={{ color: '#8a8a7a' }}>Location, soil & crop setup</p>
          </div>
        </div>
        {form.crops.length > 0 && (
          <span className="text-4xl px-2 py-1 rounded-lg" style={{ background: 'rgba(74,222,128,0.08)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.15)' }}>
            {form.crops.length} crops
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Basic fields — 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: t('farmName'), field: 'farm_name', type: 'text', placeholder: 'My Farm' },
            { label: t('landSize'), field: 'land_size', type: 'number', placeholder: '5' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="text-4xl font-medium block mb-1.5" style={{ color: '#6a6a5a' }}>{label}</label>
              <input
                type={type}
                value={(form as any)[field]}
                placeholder={placeholder}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full text-4xl px-3 py-2.5 rounded-xl"
                style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.1)')}
              />
            </div>
          ))}
          <div>
            <label className="text-4xl font-medium block mb-1.5" style={{ color: '#6a6a5a' }}>{t('state')}</label>
            <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
              className="w-full text-4xl px-3 py-2.5 rounded-xl appearance-none"
              style={{ ...inputBase, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234ade80' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.1)')}>
              {STATES.map(s => <option key={s} value={s} style={{ background: '#f5f0e8' }}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-4xl font-medium block mb-1.5" style={{ color: '#6a6a5a' }}>{t('district')}</label>
            <input value={form.district} placeholder={t('enterDistrict')} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
              className="w-full text-4xl px-3 py-2.5 rounded-xl" style={inputBase}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.1)')} />
          </div>
        </div>

        {/* Divider */}
        <div className="mb-5" style={{ height: '1px', background: 'rgba(255,255,255,0.02)' }} />

        {/* Soil Type */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-4xl font-semibold" style={{ color: '#3a3a2a' }}>{t('soilType')}</span>
              <span className="text-4xl ml-2" style={{ color: '#b0b0a0' }}>select all that apply</span>
            </div>
            {form.soil_types.length > 0 && (
              <span className="text-4xl px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#16a34a' }}>
                {form.soil_types.length} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {SOIL_TYPES.map(soil => {
              const on = form.soil_types.includes(soil)
              return (
                <button key={soil} onClick={() => toggleSoil(soil)}
                  className="text-4xl px-3 py-1.5 rounded-lg transition-all"
                  style={on
                    ? { background: 'rgba(74,222,128,0.12)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.35)', fontWeight: 500 }
                    : { color: '#8a8a7a', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                  {on && <span className="mr-1.5 text-green-400" style={{ fontSize: 9 }}>✓</span>}{soil}
                </button>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-5" style={{ height: '1px', background: 'rgba(255,255,255,0.02)' }} />

        {/* Crops */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl font-semibold" style={{ color: '#3a3a2a' }}>{t('cropsYouGrow')}</span>
            {form.crops.length > 0 && (
              <span className="text-4xl px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#16a34a' }}>
                {form.crops.length} {t('selected')}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-4xl" style={{ color: 'rgba(74,222,128,0.4)' }}>🔍</span>
            <input value={cropSearch} placeholder="Search crops..."
              onChange={e => setCropSearch(e.target.value)}
              className="w-full text-4xl pl-8 pr-3 py-2.5 rounded-xl" style={inputBase}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.1)')} />
          </div>

          {/* Category tabs */}
          {!cropSearch && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {CROP_CATEGORIES.map(({ label, icon }) => (
                <button key={label} onClick={() => setActiveCategory(label)}
                  className="text-4xl px-2.5 py-1 rounded-lg transition-all"
                  style={activeCategory === label
                    ? { background: 'rgba(74,222,128,0.15)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.3)', fontWeight: 500 }
                    : { color: '#8a8a7a', border: '1px solid rgba(0,0,0,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          )}

          {/* Crop pills */}
          <div className="flex flex-wrap gap-2 mb-3">
            {activeCrops.map(crop => (
              <button key={crop} onClick={() => toggleCrop(crop)}
                className="text-4xl px-3 py-1.5 rounded-lg transition-all"
                style={form.crops.includes(crop)
                  ? { background: 'rgba(74,222,128,0.12)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.35)', fontWeight: 500 }
                  : { color: '#8a8a7a', border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                {form.crops.includes(crop) && <span className="mr-1.5" style={{ fontSize: 9 }}>✓</span>}{crop}
              </button>
            ))}
          </div>

          {/* Selected chips */}
          {form.crops.length > 0 && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
              <p className="text-4xl mb-2" style={{ color: '#8a8a7a' }}>{t('selectedCrops')}</p>
              <div className="flex flex-wrap gap-1.5">
                {form.crops.map(crop => (
                  <span key={crop} onClick={() => toggleCrop(crop)}
                    className="text-4xl px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:opacity-70"
                    style={{ background: 'rgba(74,222,128,0.1)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.2)' }}>
                    {crop} <span style={{ opacity: 0.5 }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <button onClick={handleSave}
          className="w-full py-3 text-4xl font-semibold rounded-xl transition-all"
          style={{
            background: saved ? 'rgba(22,163,74,0.9)' : '#16a34a',
            color: '#1a1a1a',
            boxShadow: saved ? 'none' : '0 4px 16px rgba(22,163,74,0.25)',
          }}
          onMouseEnter={e => !saved && (e.currentTarget.style.background = '#15803d')}
          onMouseLeave={e => !saved && (e.currentTarget.style.background = '#16a34a')}>
          {saved ? '✓ ' + t('saved') : t('saveFarmSettings')}
        </button>
      </div>
    </div>
  )
}