// api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idea, tone } = req.body;

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
    `;

    const GEMINI_KEY = "AIzaSyBivOGrfNvS6uc2-ovY6Nw1PXTpnS5_-3s";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanJSON = JSON.parse(text);
    res.status(200).json(cleanJSON);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
