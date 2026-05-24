import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { crop, weather } = await req.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You are an agricultural advisor for Indian farmers. Always respond with valid JSON only. No markdown, no explanation.',
        },
        {
          role: 'user',
          content: `Give farming advice for ${crop} crop in India. Current weather: ${weather.temp}°C, humidity ${weather.humidity}%, ${weather.description}. Return this exact JSON structure:
{"irrigation":"specific advice here","fertilizer":"specific advice here","pestControl":"specific advice here","harvesting":"specific advice here","tips":["tip 1","tip 2","tip 3"]}`,
        },
      ],
    }),
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content ?? ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return NextResponse.json(JSON.parse(clean))
  } catch {
    return NextResponse.json({
      irrigation: `At ${weather.temp}°C, irrigate ${crop} early morning every 3-4 days. Avoid waterlogging.`,
      fertilizer: `Apply Urea 50kg/acre for ${crop}. Add DAP before next rain.`,
      pestControl: `High humidity (${weather.humidity}%) increases fungal risk. Spray neem oil weekly.`,
      harvesting: `${crop} is best harvested in early morning for maximum yield and quality.`,
      tips: ['Test soil pH every season', 'Use drip irrigation to save 40% water', 'Keep crop rotation records'],
    })
  }
}