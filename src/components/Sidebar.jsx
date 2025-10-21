// src/components/Sidebar.jsx
import React from 'react'
import { useChat } from '../contexts/ChatContext'

function Sidebar() {
  const { state, dispatch } = useChat()

  const handleNewChat = () => {
    dispatch({ type: 'CREATE_NEW_CHAT' })
  }

  const handleSelectChat = (chat) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chat })
  }

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation()
    dispatch({ type: 'DELETE_CHAT', payload: chatId })
  }

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' })
  }

  return (
    <div className={`w-64 flex flex-col h-full transition-colors duration-200 ${
      state.darkMode 
        ? 'bg-gray-800 text-white border-r border-gray-700' 
        : 'bg-white text-gray-900 border-r border-gray-200'
    }`}>
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewChat}
          className={`w-full py-2 px-4 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2 ${
            state.darkMode
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
              : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Pitch
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {state.chats.length === 0 ? (
          <div className={`text-center p-4 text-sm ${
            state.darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No previous pitches
          </div>
        ) : (
          state.chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`p-3 rounded-lg mb-1 cursor-pointer transition-colors duration-200 group relative ${
                state.currentChat?.id === chat.id
                  ? state.darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                  : state.darkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    state.darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {chat.title}
                  </p>
                  <p className={`text-xs truncate ${
                    state.darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 hover:text-white rounded transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with Dark Mode Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            state.darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {state.darkMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            )}
          </svg>
          {state.darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  )
}

export default Sidebar