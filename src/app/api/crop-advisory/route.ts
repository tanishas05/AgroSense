import { NextRequest, NextResponse } from 'next/server'
import { API_URLS, AI_MODELS, AI_MAX_TOKENS, UNKNOWN_LOCATION_VILLAGE } from '@/lib/config'

export async function POST(req: NextRequest) {
  const { crop, weather, village, district, state, question } = await req.json()

  const locationParts = [village, district, state].filter(Boolean)
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'India'
  const isVillageLevel = Boolean(village && village !== UNKNOWN_LOCATION_VILLAGE)

  // If a full question was asked (e.g. from voice), use it directly as context.
  // Otherwise treat crop as the crop name for structured advisory.
  const isQuestion = question && question.length > 30
  const cropLabel = isQuestion ? 'general farming' : crop

  const systemPrompt = `You are an expert agricultural advisor for Indian farmers. You give HYPERLOCAL, VILLAGE-SPECIFIC advice based on the crop, GPS location, and live weather data provided. Respond with valid JSON only. No markdown, no explanation.`

  const userPrompt = isQuestion
    ? `A farmer asked: "${question}"

Location: ${locationStr}${isVillageLevel ? ` (village-level precision)` : ''}
Current weather: ${weather.temp}°C, humidity ${weather.humidity}%, ${weather.description}

Answer their question with specific, actionable advice for this location and weather. Return this exact JSON:
{"irrigation":"answer/advice","fertilizer":"relevant advice","pestControl":"relevant advice","harvesting":"relevant advice","tips":["tip 1","tip 2","tip 3"]}`
    : `Give highly specific farming advice for ${cropLabel} crop.

Location: ${locationStr}${isVillageLevel ? ` (village-level precision)` : ''}
Current weather at this location: ${weather.temp}°C, humidity ${weather.humidity}%, ${weather.description}

Important: Your advice must be SPECIFIC to ${village ?? locationStr} — mention local conditions, nearby markets if known, regional pest patterns, and the specific season. Do NOT give generic advice.

Return this exact JSON:
{"irrigation":"specific village-level advice","fertilizer":"specific advice for this region","pestControl":"pest risks specific to ${weather.humidity}% humidity at ${weather.temp}°C in this area","harvesting":"harvesting advice for this location and season","tips":["hyperlocal tip 1","hyperlocal tip 2","hyperlocal tip 3"]}`

  try {
    const response = await fetch(`${API_URLS.groq}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODELS.text,
        max_tokens: AI_MAX_TOKENS.cropAdvisory,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ''

    try {
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      return NextResponse.json({ ...parsed, village: village ?? null, location: locationStr })
    } catch {
      throw new Error('JSON parse failed')
    }
  } catch {
    return NextResponse.json({
      irrigation: `At ${weather.temp}°C in ${locationStr}, irrigate ${crop} early morning (5–7am) every ${weather.temp > 35 ? '2–3' : '4–5'} days. Avoid evening irrigation to reduce fungal risk.`,
      fertilizer: `For ${crop} in ${locationStr}: Apply Urea 50kg/acre this week. With ${weather.humidity}% humidity, DAP absorption is ${weather.humidity > 70 ? 'optimal' : 'reduced — add 10% extra'}.`,
      pestControl: `${weather.humidity > 75 ? `High humidity (${weather.humidity}%) in ${village ?? locationStr} — spray copper fungicide immediately.` : `Monitor for ${weather.temp > 32 ? 'whitefly and aphids' : 'stem borer'} common in this region.`}`,
      harvesting: `${crop} harvest in ${locationStr} is best done in early morning. Check local ${district ?? 'district'} mandi price before deciding timing.`,
      tips: [
        `Check ${district ?? 'district'} mandi rates before selling`,
        `Local soil in this region benefits from green manure`,
        `Connect with Krishi Vigyan Kendra in ${district ?? 'your district'}`,
      ],
      village: village ?? null,
      location: locationStr,
    })
  }
}