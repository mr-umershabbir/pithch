// src/components/DownloadButton.jsx
import React from 'react'
import { useChat } from '../contexts/ChatContext'

function DownloadButton({ content, filename = 'pitch-content.txt' }) {
  const { state } = useChat()

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <button
      onClick={handleDownload}
      className={`px-3 py-1 text-sm rounded transition-colors duration-200 flex items-center space-x-1 ${
        state.darkMode
          ? 'bg-gray-700 hover:bg-gray-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Download</span>
    </button>
  )
}

export default DownloadButton