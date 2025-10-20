import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CreatePitch({ user }) {
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [pitchResult, setPitchResult] = useState(""); // 👈 added for AI response

  const onGenerate = async () => {
    if (!idea.trim()) return setNote("Please enter an idea.");
    setLoading(true);
    setNote("Calling AI service...");
    setPitchResult(""); // clear previous result

    try {
      // ✅ make sure correct backend URL
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, tone }),
      });

      if (!res.ok) throw new Error("AI service error");
      const data = await res.json();
      console.log("AI Response:", data);

      // save in Firestore
      const pitchDoc = {
        owner: user.uid,
        idea,
        tone,
        generated: data,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "pitches"), pitchDoc);

      // ✅ display AI result
      setPitchResult(
        data.pitch || data.tagline || JSON.stringify(data, null, 2)
      );

      setNote("Pitch generated and saved...");
      setIdea("");
    } catch (err) {
      console.error("❌ Error:", err);
      setNote(
        "AI generation failed — check server logs / implement /api/generate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Create a new pitch</h3>

      <label>Idea (short)</label>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={3}
      />

      <label>Tone</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option>Professional</option>
        <option>Casual</option>
        <option>Playful</option>
      </select>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Pitch"}
        </button>
        <small style={{ marginLeft: 12, color: "#6b7280" }}>{note}</small>
      </div>

      {/* ✅ Render AI output */}
      {pitchResult && (
        <div
          style={{
            marginTop: 20,
            background: "#f9fafb",
            padding: "10px 14px",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          <h4>Generated Pitch:</h4>
          <p>{pitchResult}</p>
        </div>
      )}
    </div>
  );
}
