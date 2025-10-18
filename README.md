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
