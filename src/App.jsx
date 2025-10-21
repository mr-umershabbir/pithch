// src/App.jsx
import React from 'react'
import ChatInterface from './components/ChatInterface'
import { ChatProvider } from './contexts/ChatContext'

function App() {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <ChatInterface />
      </div>
    </ChatProvider>
  )
}

export default App