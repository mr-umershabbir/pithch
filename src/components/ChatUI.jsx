import React, { useEffect, useRef, useState } from "react";

export default function ChatUI({ onSubmit, streamingMode, language }) {
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const addBotChunk = (section, chunk) => {
    setMessages((m) => {
      const last = m[m.length - 1];
      if (last && last.role === "assistant" && last.section === section) {
        last.text += chunk;
        return [...m.slice(0, -1), last];
      }
      return [...m, { role: "assistant", section, text: chunk }];
    });
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-list" ref={listRef} aria-live="polite">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${m.role}`}
            data-section={m.section}
          >
            <div className="bubble-meta">
              <strong>
                {m.role === "user" ? "You" : m.section === "A" ? "Pitch" : ""}
              </strong>
            </div>
            <div className="bubble-text">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
