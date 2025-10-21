# PitchCraft - Frontend-first Pitch Generator

This is a frontend-first React demo of a pitch-generator UI with a mocked streaming backend.

Run locally:

1. Install dependencies

```powershell
npm install
```

2. Start dev (frontend + mock server)

```powershell
npm run dev
```

3. Open http://localhost:5173

API spec (mock streaming endpoint)

POST /api/stream

- Request JSON: all input fields from the form.
- Response: `text/event-stream` SSE with `data: <json>` events. Each event is JSON with fields:
  - section: "A" | "B" | "C"
  - type: "text" | "code" | "meta"
  - content: string (partial text)
  - done: boolean

Example chunk:

```json
{ "section": "A", "type": "text", "content": "Curated", "done": false }
```

Replace the mock endpoint with your LLM streaming endpoint in production.

# PitchCraft - Starter (React + Vite + Firebase)

Ye starter project **PitchCraft** ke liye hai — React (Vite) frontend, Firebase Auth + Firestore backend.
AI integration (Gemini / OpenAI) ka endpoint placeholder diya gaya hai (serverless function recommended).

## Quick start

1. Node.js install karo (v18+ recommended).
2. Repo folder mein:
   ```
   npm install
   npm run dev
   ```
3. Firebase console pe project banao, Auth (Email/Password) enable karo, Firestore create karo, phir config values `src/firebase.js` mein daalo.
4. AI integration ke liye ek serverless function bana kar `/api/generate` endpoint set karo jo API key securely use kare.

## What is included

- Signup / Login / Logout (Firebase Auth)
- Create & Save pitches to Firestore
- Generate pitch button (calls `/api/generate` — implement server-side)
- Basic responsive CSS

## Notes

- Do not commit real API keys to git. Use environment variables or platform secrets (Vercel, Firebase Functions config, etc).
