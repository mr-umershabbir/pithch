// src/components/ChatArea.jsx
import React, { useEffect, useRef } from 'react'
import { useChat } from '../contexts/ChatContext'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'

function ChatArea() {
  const { state } = useChat()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [state.currentChat?.messages])

  if (!state.currentChat) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 ${
        state.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Pitch Generator AI</h1>
          <p className={`text-lg mb-6 ${
            state.darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Generate professional business pitches with AI. Describe your idea and get a complete pitch deck with marketing strategy and landing page code.
          </p>
          <div className={`p-4 rounded-lg ${
            state.darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <p className="text-sm mb-2">Try examples:</p>
            <ul className={`text-sm space-y-1 ${
              state.darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>• "A delivery app for local grocery stores"</li>
              <li>• "Subscription box for artisanal coffee"</li>
              <li>• "AI-powered fitness coaching platform"</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 flex flex-col h-full ${
      state.darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 ${
        state.darkMode 
          ? 'border-gray-700 bg-gray-800 text-white' 
          : 'border-gray-200 bg-white text-gray-900'
      }`}>
        <h1 className="text-lg font-semibold">Pitch Generator AI</h1>
        <p className={`text-sm ${
          state.darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {state.currentChat.title}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {state.currentChat.messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              isLast={index === state.currentChat.messages.length - 1}
            />
          ))}
          {state.isGenerating && (
            <div className="fade-in">
              <div className={`p-4 rounded-lg max-w-3xl ${
                state.darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    state.darkMode ? 'bg-purple-600' : 'bg-purple-500'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <InputBar />
    </div>
  )
}

export default ChatArea