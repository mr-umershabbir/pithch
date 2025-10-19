// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { idea, tone } = req.body
  const GEMINI_KEY = "AIzaSyAVue_oUhOSOEQ3xqus5gBfR0yzfjX1ayM"

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    )

    const result = await response.json()

    // 🧩 Debug log
    console.log("🔍 Gemini raw result:", JSON.stringify(result, null, 2))

    // Gemini kabhi empty candidates deta hai:
    if (!result?.candidates?.length) {
      return res.status(200).json({
        name: "PitchCraft",
        tagline: "No response from Gemini",
        pitch: "AI did not return any text. Check API key or quota.",
        audience: "Developers",
        landingCopy: "Error: Empty response"
      })
    }

    let text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""

    // agar response empty ho
    if (!text) {
      text = JSON.stringify({
        name: "PitchCraft",
        tagline: "Empty Response",
        pitch: "Gemini returned no text output.",
        audience: "Students",
        landingCopy: "Try again or check API key."
      })
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (err) {
      parsed = {
        name: "PitchCraft",
        tagline: "Parse Error",
        pitch: text || "No text returned"
      }
    }

    res.status(200).json(parsed)
  } catch (error) {
    console.error("❌ Gemini Error:", error)
    res.status(500).json({ error: error.message })
  }
}
