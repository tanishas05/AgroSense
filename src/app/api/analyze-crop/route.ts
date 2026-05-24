import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { image, mimeType, cropName } = await req.json()

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${image}`,
                },
              },
              {
                type: 'text',
                text: `You are an expert agricultural scientist. Analyze this crop image${cropName ? ` of ${cropName}` : ''} from India. Look carefully at the leaves, stems, and overall plant health.

Respond with ONLY valid JSON, no markdown, no explanation:
{"disease":"exact disease name or Healthy","confidence":90,"severity":"Low","healthScore":75,"treatment":["specific step 1","specific step 2","specific step 3"],"nutrients":[],"summary":"2 sentence summary of what you actually see in this image"}`,
              },
            ],
          },
        ],
      }),
    })

    const data = await response.json()
    console.log('Groq vision response:', JSON.stringify(data))

    if (data.error) throw new Error(data.error.message)

    const text = data.choices?.[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    return NextResponse.json(JSON.parse(clean))

  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({
      disease: 'Analysis Error',
      confidence: 0,
      severity: 'Unknown',
      healthScore: 0,
      treatment: ['Please try again'],
      nutrients: [],
      summary: String(e),
    })
  }
}