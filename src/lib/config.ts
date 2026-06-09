// ─── AgroSense Centralized Config ─────────────────────────────────────────────
// All magic numbers, default values, and constants live here.
// API secrets stay in .env — everything else is imported from this file.

// ─── Default / Fallback Location ──────────────────────────────────────────────
export const DEFAULT_LOCATION = {
  lat: process.env.NEXT_PUBLIC_DEFAULT_LAT ? parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT) : 28.6667,
  lon: process.env.NEXT_PUBLIC_DEFAULT_LON ? parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LON) : 77.2167,
  village:  process.env.NEXT_PUBLIC_DEFAULT_VILLAGE  ?? 'New Delhi',
  district: process.env.NEXT_PUBLIC_DEFAULT_DISTRICT ?? 'New Delhi',
  state:    process.env.NEXT_PUBLIC_DEFAULT_STATE    ?? 'Delhi',
  display:  process.env.NEXT_PUBLIC_DEFAULT_DISPLAY  ?? 'New Delhi, Delhi',
}

// ─── External API Base URLs ────────────────────────────────────────────────────
export const API_URLS = {
  groq:        process.env.GROQ_API_BASE_URL        ?? 'https://api.groq.com/openai/v1',
  openWeather: process.env.OPENWEATHER_API_BASE_URL ?? 'https://api.openweathermap.org/data/2.5',
  dataGovIn:   process.env.DATA_GOV_API_BASE_URL    ?? 'https://api.data.gov.in/resource',
  nominatim:   process.env.NOMINATIM_BASE_URL       ?? 'https://nominatim.openstreetmap.org',
}

// ─── Government Mandi API ─────────────────────────────────────────────────────
export const MANDI_RESOURCE_ID =
  process.env.DATA_GOV_MANDI_RESOURCE_ID ?? '9ef84268-d588-465a-a308-a864a43d0070'

// ─── AI Models ────────────────────────────────────────────────────────────────
export const AI_MODELS = {
  vision: process.env.GROQ_MODEL_VISION ?? 'meta-llama/llama-4-scout-17b-16e-instruct',
  text:   process.env.GROQ_MODEL_TEXT   ?? 'llama3-8b-8192',
}

// ─── AI Token Limits ──────────────────────────────────────────────────────────
export const AI_MAX_TOKENS = {
  cropAnalysis: process.env.AI_MAX_TOKENS_CROP_ANALYSIS ? parseInt(process.env.AI_MAX_TOKENS_CROP_ANALYSIS) : 512,
  cropAdvisory: process.env.AI_MAX_TOKENS_CROP_ADVISORY ? parseInt(process.env.AI_MAX_TOKENS_CROP_ADVISORY) : 600,
}

// ─── Mandi / Market ───────────────────────────────────────────────────────────
// Shared commodity list used across mandi API routes, MarketCard, PriceTrends
export const MANDI_DEFAULT_COMMODITIES = ['Wheat', 'Onion', 'Tomato', 'Maize']

// Extended list used in PriceTable
export const MANDI_ALL_COMMODITIES = [
  'Wheat', 'Onion', 'Tomato', 'Maize',
  'Rice', 'Potato', 'Soybean', 'Cotton',
]

// How many mandi records to fetch per commodity
export const MANDI_FETCH_LIMIT = 3

// ─── Database / Supabase Query Limits ─────────────────────────────────────────
export const DB_LIMITS = {
  scans:  10,
  alerts: 20,
}

// ─── Cache & Revalidation TTLs (seconds unless noted) ─────────────────────────
export const CACHE_TTL = {
  weather:        1800,       // 30 min  — OpenWeatherMap current/forecast
  location:       3600,       // 1 hour  — Nominatim reverse geocode
  mandiPrices:    3600,       // 1 hour  — data.gov.in mandi prices
  offlineCache:   6 * 60 * 60 * 1000, // 6 hours — localStorage offline cache (ms)
}

// ─── Voice / Speech ───────────────────────────────────────────────────────────
export const SPEECH = {
  rate: 0.88,
  langMap: {
    hi: 'hi-IN',
    en: 'en-IN',
  } as Record<string, string>,
}

// ─── SMS Advisory ─────────────────────────────────────────────────────────────
export const SMS = {
  number:        process.env.NEXT_PUBLIC_SMS_NUMBER       ?? '',
  shortcodeHint: process.env.NEXT_PUBLIC_SMS_SHORTCODE    ?? 'CROP <crop name>',
}

// ─── Nominatim User-Agent ─────────────────────────────────────────────────────
export const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ?? 'AgroSense/1.0'

// ─── Marketing / Hero Stats ───────────────────────────────────────────────────
// These are display-only counters on the landing page.
// Update here when real numbers change — never hardcode in components.
export const HERO_STATS = {
  farmers:   { value: 24,  suffix: 'L+' },  // displayed as counter animation
  accuracy:  { value: 95,  suffix: '%'  },
  languages: { value: 12,  suffix: '+'  },
}

// ─── Copyright ────────────────────────────────────────────────────────────────
export const COPYRIGHT_YEAR = new Date().getFullYear()

// ─── Offline cache fallback city ──────────────────────────────────────────────
// Used when priming the offline weather cache and no user location is available
export const OFFLINE_CACHE_FALLBACK_CITY =
  process.env.NEXT_PUBLIC_OFFLINE_FALLBACK_CITY ?? 'Delhi'

// ─── Weather route fallback city ──────────────────────────────────────────────
export const WEATHER_FALLBACK_CITY =
  process.env.NEXT_PUBLIC_WEATHER_FALLBACK_CITY ?? 'Nashik'