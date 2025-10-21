// src/components/MessageBubble.jsx
import React from 'react'
import { useChat } from '../contexts/ChatContext'
import ResponseCard from './ResponseCard'

function MessageBubble({ message, isLast }) {
  const { state } = useChat()

  if (message.role === 'user') {
    return (
      <div className="fade-in flex justify-end">
        <div className={`max-w-3xl rounded-lg px-4 py-3 ${
          state.darkMode 
            ? 'bg-purple-600 text-white' 
            : 'bg-purple-500 text-white'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  // AI message with structured responses
  return (
    <div className="fade-in">
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          state.darkMode ? 'bg-green-600' : 'bg-green-500'
        }`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          {message.responses ? (
            <div className="space-y-4">
              {message.responses.map((response, index) => (
                <ResponseCard
                  key={index}
                  response={response}
                  isComplete={message.isComplete}
                  isStreaming={isLast && !message.isComplete && index === message.responses.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className={`rounded-lg p-4 ${
              state.darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble