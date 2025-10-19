// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { idea, tone } = req.body
  const GEMINI_KEY = "AIzaSyBivOGrfNvS6uc2-ovY6Nw1PXTpnS5_-3s"  // 👈 apni API key lagao

  try {
    const prompt = `
    Tum ek AI ho jo startup pitches likhta hai.
    Idea: ${idea}
    Tone: ${tone}
    Output JSON format me do:
    {
      "name": "",
      "tagline": "",
      "pitch": "",
      "audience": "",
      "landingCopy": ""
    }
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    )

    const result = await response.json()

    // ---- FIX START ----
    let text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

    // Agar Gemini ne JSON nahi diya, to JSON banana
    if (!text.startsWith('{')) {
      text = JSON.stringify({
        name: 'PitchCraft Idea',
        tagline: 'AI pitch generated text',
        pitch: text,
        audience: 'Students',
        landingCopy: 'Could not parse Gemini output fully.'
      })
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (err) {
      parsed = { name: 'PitchCraft', tagline: 'Parse Error', pitch: text }
    }
    // ---- FIX END ----

    res.status(200).json(parsed)
  } catch (error) {
    console.error('Gemini Error:', error)
    res.status(500).json({ error: error.message })
  }
}
