// src/components/ResponseCard.jsx
import React, { useState } from 'react'
import { useChat } from '../contexts/ChatContext'
import DownloadButton from './DownloadButton'

function ResponseCard({ response, isComplete, isStreaming }) {
  const { state } = useChat()
  const [activeTab, setActiveTab] = useState('preview')

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleCopyAll = () => {
    const allContent = [
      `# ${response.title}\n\n${response.content}`,
      response.code && `\n## Code\n\n${response.code}`,
      response.features && `\n## Features\n\n${response.features}`
    ].filter(Boolean).join('\n\n')
    
    navigator.clipboard.writeText(allContent)
  }

  const getResponseContent = () => {
    if (!isComplete && isStreaming) {
      return response.content + '█'
    }
    return response.content
  }

  const getDownloadContent = () => {
    return [
      `# ${response.title}\n\n${response.content}`,
      response.code && `\n## Code\n\n${response.code}`,
      response.features && `\n## Features\n\n${response.features}`
    ].filter(Boolean).join('\n\n')
  }

  if (response.type === 'pitch_summary' || response.type === 'audience_marketing') {
    return (
      <div className={`fade-in rounded-lg border ${
        state.darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`px-4 py-3 border-b ${
          state.darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{response.title}</h3>
            <div className="flex items-center space-x-2">
              <DownloadButton 
                content={getDownloadContent()}
                filename={`${response.title.toLowerCase().replace(/\s+/g, '-')}.txt`}
              />
              <button
                onClick={handleCopyAll}
                className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {getResponseContent()}
          </div>
        </div>
      </div>
    )
  }

  if (response.type === 'landing_page') {
    return (
      <div className={`fade-in rounded-lg border ${
        state.darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`px-4 py-3 border-b ${
          state.darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{response.title}</h3>
            <div className="flex items-center space-x-2">
              <DownloadButton 
                content={getDownloadContent()}
                filename={`${response.title.toLowerCase().replace(/\s+/g, '-')}.txt`}
              />
              <button
                onClick={handleCopyAll}
                className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Copy All
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b ${
          state.darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex -mb-px px-4">
            {['preview', 'code', 'features'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors duration-200 capitalize ${
                  activeTab === tab
                    ? state.darkMode
                      ? 'border-purple-500 text-purple-400'
                      : 'border-purple-500 text-purple-600'
                    : state.darkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {getResponseContent()}
              </div>
            </div>
          )}

          {activeTab === 'code' && response.code && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  HTML + Tailwind CSS
                </span>
                <div className="flex items-center space-x-2">
                  <DownloadButton 
                    content={response.code}
                    filename={`${response.title.toLowerCase().replace(/\s+/g, '-')}-code.html`}
                  />
                  <button
                    onClick={() => handleCopy(response.code)}
                    className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                      state.darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Copy Code
                  </button>
                </div>
              </div>
              <pre className={`text-sm p-4 rounded overflow-x-auto ${
                state.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
              }`}>
                <code>{response.code}</code>
              </pre>
            </div>
          )}

          {activeTab === 'features' && response.features && (
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {response.features}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default ResponseCard