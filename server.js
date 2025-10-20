const dotenv = require("dotenv");
dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const express = require("express");
const cors = require("cors");
const handler = require("./api/generate.js");

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    await handler.default(req, res);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Only start the server if we're running this file directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API Server running at http://localhost:${port}`);
  });
}
