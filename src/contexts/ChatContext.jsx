// src/contexts/ChatContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react'

const ChatContext = createContext()

const initialState = {
  chats: [],
  currentChat: null,
  isGenerating: false,
  darkMode: false
}

function chatReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CHATS':
      return { ...state, chats: action.payload }
    
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload }
    
    case 'ADD_MESSAGE':
      if (!state.currentChat) return state
      
      const updatedCurrentChat = {
        ...state.currentChat,
        messages: [...state.currentChat.messages, action.payload]
      }
      
      const updatedChats = state.chats.map(chat =>
        chat.id === updatedCurrentChat.id ? updatedCurrentChat : chat
      )
      
      return {
        ...state,
        currentChat: updatedCurrentChat,
        chats: updatedChats
      }
    
    case 'UPDATE_LAST_MESSAGE':
      if (!state.currentChat) return state
      
      const lastMessageIndex = state.currentChat.messages.length - 1
      if (lastMessageIndex < 0) return state
      
      const messages = [...state.currentChat.messages]
      messages[lastMessageIndex] = {
        ...messages[lastMessageIndex],
        content: action.payload.content,
        isComplete: action.payload.isComplete
      }
      
      const updatedChatWithStream = {
        ...state.currentChat,
        messages
      }
      
      const updatedChatsStream = state.chats.map(chat =>
        chat.id === updatedChatWithStream.id ? updatedChatWithStream : chat
      )
      
      return {
        ...state,
        currentChat: updatedChatWithStream,
        chats: updatedChatsStream
      }
    
    case 'CREATE_NEW_CHAT':
      const newChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString()
      }
      return {
        ...state,
        currentChat: newChat,
        chats: [newChat, ...state.chats]
      }
    
    case 'DELETE_CHAT':
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload)
      const newCurrentChat = state.currentChat?.id === action.payload ? null : state.currentChat
      return {
        ...state,
        chats: filteredChats,
        currentChat: newCurrentChat
      }
    
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload }
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    
    case 'UPDATE_CHAT_TITLE':
      const chatsWithUpdatedTitle = state.chats.map(chat =>
        chat.id === action.payload.chatId
          ? { ...chat, title: action.payload.title }
          : chat
      )
      
      const updatedCurrentChatTitle = state.currentChat?.id === action.payload.chatId
        ? { ...state.currentChat, title: action.payload.title }
        : state.currentChat
      
      return {
        ...state,
        chats: chatsWithUpdatedTitle,
        currentChat: updatedCurrentChatTitle
      }
    
    default:
      return state
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('pitchCraftChats')
    const savedDarkMode = localStorage.getItem('pitchCraftDarkMode')
    
    if (savedChats) {
      dispatch({ type: 'LOAD_CHATS', payload: JSON.parse(savedChats) })
    }
    
    if (savedDarkMode) {
      dispatch({ type: 'TOGGLE_DARK_MODE' })
    }
  }, [])

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('pitchCraftChats', JSON.stringify(state.chats))
  }, [state.chats])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('pitchCraftDarkMode', state.darkMode.toString())
  }, [state.darkMode])

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}