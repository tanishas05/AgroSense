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
                image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${image}` },
              },
              {
                type: 'text',
                text: `You are an expert agricultural scientist. First check if this image is actually a plant, crop, leaf, or agricultural field.

If it is NOT a crop/plant image, respond with exactly:
{"error":"not_a_crop","message":"Please upload a photo of a crop or plant leaf"}

If it IS a crop/plant image${cropName ? ` of ${cropName}` : ''}, analyze it and respond with ONLY this JSON:
{"disease":"exact disease name or Healthy","confidence":90,"severity":"Low","healthScore":75,"treatment":["specific step 1","specific step 2","specific step 3"],"nutrients":[],"summary":"2 sentence summary of what you actually see"}`,
              },
            ],
          },
        ],
      }),
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    const text = data.choices?.[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    if (parsed.error === 'not_a_crop') {
      return NextResponse.json({
        disease: 'Invalid image',
        confidence: 0,
        severity: 'Unknown',
        healthScore: 0,
        treatment: ['Please upload a photo of a crop or plant leaf, not a random image'],
        nutrients: [],
        summary: parsed.message,
      })
    }

    return NextResponse.json(parsed)
  } catch (e) {
    return NextResponse.json({
      disease: 'Analysis Error',
      confidence: 0,
      severity: 'Unknown',
      healthScore: 0,
      treatment: ['Please try again with a clearer crop photo'],
      nutrients: [],
      summary: 'Could not analyze the image. Please upload a clear photo of a crop or plant.',
    })
  }
}