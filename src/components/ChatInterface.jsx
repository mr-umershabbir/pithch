// src/components/ChatInterface.jsx
import React from 'react'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import { useChat } from '../contexts/ChatContext'

function ChatInterface() {
  const { state } = useChat()

  return (
    <>
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        state.darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <ChatArea />
      </div>
    </>
  )
}

export default ChatInterface