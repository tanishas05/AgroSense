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

const inputStyle = { background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)', color: '#e8f5e2', outline: 'none' }

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
    setTimeout(() => setSaved(false), 2000)
  }

  // Only render crops for the active category — never all at once
  const activeCrops = cropSearch
    ? CROP_CATEGORIES.flatMap(c => c.crops).filter(c => c.toLowerCase().includes(cropSearch.toLowerCase())).slice(0, 20)
    : (CROP_CATEGORIES.find(c => c.label === activeCategory)?.crops ?? [])

  if (loading) return <div className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }} />

  return (
    <div className="p-6 rounded-2xl" style={{ background: 'rgba(14,28,16,0.8)', border: '1px solid rgba(74,222,128,0.08)' }}>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🏡</span>
        <h2 className="text-sm font-semibold text-white">{t('farmDetails')}</h2>
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('farmName')}</label>
          <input value={form.farm_name} onChange={e => setForm(f => ({ ...f, farm_name: e.target.value }))}
            className="w-full text-xs px-3 py-2.5 rounded-xl" style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.12)')} />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('landSize')}</label>
          <input type="number" value={form.land_size} onChange={e => setForm(f => ({ ...f, land_size: e.target.value }))}
            className="w-full text-xs px-3 py-2.5 rounded-xl" style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.12)')} />
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('state')}</label>
          <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            className="w-full text-xs px-3 py-2.5 rounded-xl" style={inputStyle}>
            {STATES.map(s => <option key={s} value={s} style={{ background: '#0a1a0d' }}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs mb-1.5 block" style={{ color: 'rgba(232,245,226,0.35)' }}>{t('district')}</label>
          <input value={form.district} placeholder={t('enterDistrict')} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
            className="w-full text-xs px-3 py-2.5 rounded-xl" style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.12)')} />
        </div>
      </div>

      {/* Soil Type — multi select pills, not a grid of 16 */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium" style={{ color: 'rgba(232,245,226,0.5)' }}>
            {t('soilType')} <span style={{ color: 'rgba(232,245,226,0.25)', fontSize: 10 }}>(select all that apply)</span>
          </label>
          {form.soil_types.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>{form.soil_types.length} selected</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {SOIL_TYPES.map(soil => {
            const on = form.soil_types.includes(soil)
            return (
              <button key={soil} onClick={() => toggleSoil(soil)}
                className="text-xs px-3 py-1.5 rounded-xl transition-all"
                style={on
                  ? { background: 'rgba(74,222,128,0.15)', color: '#86efac', border: '1px solid rgba(74,222,128,0.35)' }
                  : { color: 'rgba(232,245,226,0.4)', border: '1px solid rgba(74,222,128,0.08)' }}>
                {on && <span className="mr-1" style={{ fontSize: 9 }}>✓</span>}{soil}
              </button>
            )
          })}
        </div>
      </div>

      {/* Crops */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium" style={{ color: 'rgba(232,245,226,0.5)' }}>{t('cropsYouGrow')}</label>
          {form.crops.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>{form.crops.length} {t('selected')}</span>
          )}
        </div>

        <input value={cropSearch} placeholder="Search crops..."
          onChange={e => setCropSearch(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-xl mb-3" style={inputStyle}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.12)')} />

        {!cropSearch && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CROP_CATEGORIES.map(({ label, icon }) => (
              <button key={label} onClick={() => setActiveCategory(label)}
                className="text-xs px-2.5 py-1 rounded-lg transition-all"
                style={activeCategory === label
                  ? { background: 'rgba(74,222,128,0.15)', color: '#86efac', border: '1px solid rgba(74,222,128,0.3)' }
                  : { color: 'rgba(232,245,226,0.3)', border: '1px solid rgba(74,222,128,0.08)' }}>
                {icon} {label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {activeCrops.map(crop => (
            <button key={crop} onClick={() => toggleCrop(crop)}
              className="text-xs px-3 py-1.5 rounded-xl transition-all"
              style={form.crops.includes(crop)
                ? { background: 'rgba(74,222,128,0.15)', color: '#86efac', border: '1px solid rgba(74,222,128,0.35)' }
                : { color: 'rgba(232,245,226,0.4)', border: '1px solid rgba(74,222,128,0.08)' }}>
              {crop}
            </button>
          ))}
        </div>

        {form.crops.length > 0 && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
            <p className="text-xs mb-2" style={{ color: 'rgba(232,245,226,0.3)' }}>{t('selectedCrops')}</p>
            <div className="flex flex-wrap gap-1.5">
              {form.crops.map(crop => (
                <span key={crop} onClick={() => toggleCrop(crop)}
                  className="text-xs px-2 py-0.5 rounded-lg cursor-pointer"
                  style={{ background: 'rgba(74,222,128,0.12)', color: '#86efac', border: '1px solid rgba(74,222,128,0.2)' }}>
                  {crop} ×
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={handleSave} className="w-full py-2.5 text-xs font-semibold text-white rounded-xl"
        style={{ background: saved ? '#15803d' : '#16a34a' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
        onMouseLeave={e => (e.currentTarget.style.background = saved ? '#15803d' : '#16a34a')}>
        {saved ? t('saved') : t('saveFarmSettings')}
      </button>
    </div>
  )
}