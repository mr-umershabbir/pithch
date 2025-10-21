import React, { useEffect, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { saveAs } from "file-saver";

// Note: this is a frontend-first mock implementation. It posts to /api/stream
// which is provided by the mock server.js. In production, replace /api/stream
// with your LLM streaming endpoint.

const DEFAULT_SAMPLE = {
  businessName: "SnackBoxPK",
  shortDescription:
    "Monthly curated Pakistani snack subscription for urban professionals.",
  industry: "Food / Subscription Boxes",
  stage: "prototype",
  targetMarket:
    "Karachi & Lahore, 22–40, working professionals, disposable income $200–$800/month",
  revenueModel: "subscription",
  budgetRange: "$3,000",
  tone: "investor-ready",
  outputLength: "medium",
};

function useSSE(url, payload, onChunk, onDone, onError) {
  // returns an abort function
  const abort = () => controller.abort();
  const controller = new AbortController();

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      return reader.read().then(function process({ done, value }) {
        if (done) return onDone();
        buffer += decoder.decode(value, { stream: true });
        // SSE may include multiple data: lines; split by \n\n
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          if (part.trim().startsWith("data:")) {
            const json = part.replace(/^data:\s*/, "");
            try {
              const obj = JSON.parse(json);
              onChunk(obj);
            } catch (e) {
              /*ignore*/
            }
          }
        }
        return reader.read().then(process);
      });
    })
    .catch((err) => onError && onError(err));

  return abort;
}

export default function CreatePitch({ user }) {
  const [form, setForm] = useState(DEFAULT_SAMPLE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sections, setSections] = useState({ A: "", B: "", C: "" });
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState("word");

  const validate = () => {
    const e = {};
    if (!form.businessName || !form.businessName.trim())
      e.businessName = "Business name is required.";
    if (!form.shortDescription || !form.shortDescription.trim())
      e.shortDescription = "Short description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleUseSample = () => setForm(DEFAULT_SAMPLE);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setSections({ A: "", B: "", C: "" });
    setDone(false);

    const onChunk = (obj) => {
      if (!obj || !obj.section) return;
      setSections((prev) => ({
        ...prev,
        [obj.section]: (prev[obj.section] || "") + obj.content,
      }));
    };

    const onDone = () => {
      setDone(true);
      setLoading(false);
    };
    const onError = (err) => {
      console.error(err);
      setLoading(false);
      setDone(true);
    };

    useSSE("/api/stream", form, onChunk, onDone, onError);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (e) {
      alert("Copy failed");
    }
  };

  const savePdf = (name, html) => {
    // fallback: save plain text as .html
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    saveAs(blob, `${name}.html`);
  };

  return (
    <div className="container chat-layout">
      <div className="card">
        <h2>Pitch Generator</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Business Name *</label>
            <input
              value={form.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
            />
            {errors.businessName && (
              <div className="field-error">{errors.businessName}</div>
            )}
          </div>
          <div className="form-group">
            <label>Short Description *</label>
            <input
              value={form.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
            {errors.shortDescription && (
              <div className="field-error">{errors.shortDescription}</div>
            )}
          </div>
          <div className="form-group">
            <label>Industry / Niche</label>
            <input
              value={form.industry || ""}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Primary Product or Service</label>
            <input
              value={form.product || ""}
              onChange={(e) => handleChange("product", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Stage</label>
            <select
              value={form.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
            >
              <option>idea</option>
              <option>prototype</option>
              <option>launched</option>
              <option>scaling</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Market</label>
            <input
              value={form.targetMarket || ""}
              onChange={(e) => handleChange("targetMarket", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Revenue Model</label>
            <input
              value={form.revenueModel || ""}
              onChange={(e) => handleChange("revenueModel", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Budget Range</label>
            <input
              value={form.budgetRange || ""}
              onChange={(e) => handleChange("budgetRange", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Desired Tone</label>
            <select
              value={form.tone}
              onChange={(e) => handleChange("tone", e.target.value)}
            >
              <option>professional</option>
              <option>casual</option>
              <option>bold</option>
              <option>investor-ready</option>
              <option>friendly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Output Length</label>
            <select
              value={form.outputLength || "medium"}
              onChange={(e) => handleChange("outputLength", e.target.value)}
            >
              <option>short</option>
              <option>medium</option>
              <option>long</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {" "}
            {loading ? "Generating..." : "Generate"}
          </button>
          <button className="btn" onClick={handleUseSample} disabled={loading}>
            Use sample
          </button>
          <div style={{ marginLeft: "auto" }}>
            <label>Streaming Mode: </label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="word">Word-by-word</option>
              <option value="sentence">Sentence-by-sentence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results area: three collapsible cards */}
      <div className="results">
        {["A", "B", "C"].map((s, idx) => (
          <div
            key={s}
            className="card result-card"
            role="region"
            aria-labelledby={`heading-${s}`}
          >
            <div className="result-header">
              <div>
                <span className="badge">
                  {s === "A"
                    ? "Pitch Summary"
                    : s === "B"
                    ? "Target Audience"
                    : "Landing Page"}
                </span>
                <strong id={`heading-${s}`} style={{ marginLeft: 8 }}>
                  {s === "A"
                    ? "Pitch Summary"
                    : s === "B"
                    ? "Target Audience & Marketing"
                    : "Landing Page + Code"}
                </strong>
              </div>
              <div className="result-controls">
                <button
                  className="btn"
                  onClick={() => copyToClipboard(sections[s])}
                >
                  Copy
                </button>
                <button
                  className="btn"
                  onClick={() => savePdf(`pitch-${s}`, sections[s] || "")}
                >
                  Save as PDF
                </button>
              </div>
            </div>

            <div className="result-body" aria-live="polite">
              <pre style={{ whiteSpace: "pre-wrap" }}>{sections[s]}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
