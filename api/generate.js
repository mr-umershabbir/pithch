import dotenv from "dotenv";
dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const fetch = require("node-fetch");

module.exports = {
  default: async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { idea, tone } = req.body;
      const GEMINI_KEY = process.env.GEMINI_API_KEY;

      if (!GEMINI_KEY) {
        console.error("❌ GEMINI_API_KEY not found in environment!");
        return res
          .status(500)
          .json({ error: "Server missing Gemini API key." });
      }

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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini API");
      }

      const result = await response.json();
      console.log("🔍 Gemini raw result:", JSON.stringify(result, null, 2));

      if (!result?.candidates?.length) {
        return res.status(200).json({
          name: "PitchCraft",
          tagline: "No response from Gemini",
          pitch: "AI did not return any text. Check API key or quota.",
          audience: "Developers",
          landingCopy: "Error: Empty response",
        });
      }

      // 👇  add these 2 lines
      console.log("🔍 Gemini Raw Response ↓↓↓");
      console.dir(result, { depth: null });
      console.log("────────────────────────────");

      const text = result.candidates[0].content.parts[0].text?.trim() || "";

      if (!text) {
        return res.status(200).json({
          name: "PitchCraft",
          tagline: "Empty Response",
          pitch: "Gemini returned no text output.",
          audience: "Students",
          landingCopy: "Try again or check API key.",
        });
      }

      try {
        const parsed = JSON.parse(text);
        return res.status(200).json(parsed);
      } catch (e) {
        console.error("Failed to parse AI output:", text);
        return res.status(200).json({
          name: "PitchCraft",
          tagline: "Parse Error",
          pitch: text || "No text returned",
          audience: "Developers",
          landingCopy: "Error parsing AI response",
        });
      }
    } catch (error) {
      console.error("❌ Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  },
};
