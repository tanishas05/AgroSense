// ─── AgroSense Centralized Config ─────────────────────────────────────────────
export const DEFAULT_LOCATION = {
  lat: process.env.NEXT_PUBLIC_DEFAULT_LAT ? parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT) : 28.6667,
  lon: process.env.NEXT_PUBLIC_DEFAULT_LON ? parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LON) : 77.2167,
  village:  process.env.NEXT_PUBLIC_DEFAULT_VILLAGE  ?? 'New Delhi',
  district: process.env.NEXT_PUBLIC_DEFAULT_DISTRICT ?? 'New Delhi',
  state:    process.env.NEXT_PUBLIC_DEFAULT_STATE    ?? 'Delhi',
  display:  process.env.NEXT_PUBLIC_DEFAULT_DISPLAY  ?? 'New Delhi, Delhi',
}

export const API_URLS = {
  groq:        process.env.GROQ_API_BASE_URL        ?? 'https://api.groq.com/openai/v1',
  openWeather: process.env.OPENWEATHER_API_BASE_URL ?? 'https://api.openweathermap.org/data/2.5',
  dataGovIn:   process.env.DATA_GOV_API_BASE_URL    ?? 'https://api.data.gov.in/resource',
  nominatim:   process.env.NOMINATIM_BASE_URL       ?? 'https://nominatim.openstreetmap.org',
}

export const MANDI_RESOURCE_ID =
  process.env.DATA_GOV_MANDI_RESOURCE_ID ?? '9ef84268-d588-465a-a308-a864a43d0070'

export const AI_MODELS = {
  vision: process.env.GROQ_MODEL_VISION ?? 'meta-llama/llama-4-scout-17b-16e-instruct',
  text:   process.env.GROQ_MODEL_TEXT   ?? 'llama3-8b-8192',
}

export const AI_MAX_TOKENS = {
  cropAnalysis: process.env.AI_MAX_TOKENS_CROP_ANALYSIS ? parseInt(process.env.AI_MAX_TOKENS_CROP_ANALYSIS) : 512,
  cropAdvisory: process.env.AI_MAX_TOKENS_CROP_ADVISORY ? parseInt(process.env.AI_MAX_TOKENS_CROP_ADVISORY) : 600,
}

export const MANDI_DEFAULT_COMMODITIES = ['Wheat', 'Onion', 'Tomato', 'Maize']

export const MANDI_ALL_COMMODITIES = [
  'Wheat', 'Onion', 'Tomato', 'Maize',
  'Rice', 'Potato', 'Soybean', 'Cotton',
]

export const MANDI_FETCH_LIMIT = 3

export const DB_LIMITS = {
  scans:  10,
  alerts: 20,
}

export const CACHE_TTL = {
  weather:      1800,
  location:     3600,
  mandiPrices:  3600,
  offlineCache: 6 * 60 * 60 * 1000,
}

export const SPEECH = {
  rate: 0.88,
  langMap: {
    hi: 'hi-IN',
    en: 'en-IN',
  } as Record<string, string>,
}

export const SMS = {
  number:        process.env.NEXT_PUBLIC_SMS_NUMBER    ?? '',
  shortcodeHint: process.env.NEXT_PUBLIC_SMS_SHORTCODE ?? 'CROP <crop name>',
}

export const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ?? 'AgroSense/1.0'

export const HERO_STATS = {
  featuresCount:  { value: 6, suffix: ' features'  },
  languagesCount: { value: 2, suffix: ' languages' },
  apisCount:      { value: 5, suffix: ' live APIs'  },
}

export const COPYRIGHT_YEAR = new Date().getFullYear()

export const UNKNOWN_LOCATION_VILLAGE = 'Your Village'
export const UNKNOWN_LOCATION_DISPLAY = 'Your Location'

export const OFFLINE_CACHE_FALLBACK_CITY =
  process.env.NEXT_PUBLIC_OFFLINE_FALLBACK_CITY ?? 'Delhi'

export const WEATHER_FALLBACK_CITY =
  process.env.NEXT_PUBLIC_WEATHER_FALLBACK_CITY ?? 'Nashik'