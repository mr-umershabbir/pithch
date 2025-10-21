const dotenv = require("dotenv");
dotenv.config();

const fetch = require("node-fetch");

// POST /generate handler — expects body { idea, tone }
module.exports = {
  default: async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
    if (!GEMINI_KEY) {
      console.error("❌ GEMINI_API_KEY not set in environment");
      return res.status(500).json({ error: "Server missing Gemini API key." });
    }

    try {
      const { idea = "", tone = "Professional" } = req.body || {};

      const prompt = `Tum ek AI ho jo startup pitches likhta hai.\nIdea: ${idea}\nTone: ${tone}\nOutput JSON format me do:\n{\n  "name": "",\n  "tagline": "",\n  "pitch": "",\n  "audience": "",\n  "landingCopy": ""\n}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.error("Gemini API non-OK", response.status, errText);
        throw new Error("Failed to get response from Gemini API");
      }

      const result = await response.json();
      console.log("🔍 Gemini raw result:", JSON.stringify(result, null, 2));

      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      if (!text) {
        return res.status(200).json({
          name: "PitchCraft",
          tagline: "No content",
          pitch: "Gemini returned empty content. Check your key/quota.",
          audience: "Everyone",
          landingCopy: "Try again",
        });
      }

      try {
        const parsed = JSON.parse(text);
        return res.status(200).json(parsed);
      } catch (err) {
        // If output isn't JSON, return the text in the pitch field
        console.warn("Could not parse JSON from Gemini. Returning text.", err);
        return res.status(200).json({
          name: "PitchCraft",
          tagline: "Generated text",
          pitch: text,
          audience: "General",
          landingCopy: "",
        });
      }
    } catch (error) {
      console.error("❌ Gemini Error:", error);
      return res.status(500).json({ error: error.message });
    }
  },
};
