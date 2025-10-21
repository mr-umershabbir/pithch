import React, { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-2 mb-2">
        {tabs.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setActive(i)}
            className={`px-3 py-1 rounded ${
              i === active ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>
      <div className="p-3 bg-gray-50 rounded">{tabs[active].content}</div>
    </div>
  );
}
