// src/components/InputBar.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '../contexts/ChatContext'

function InputBar() {
  const { state, dispatch } = useChat()
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || state.isGenerating) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    // Add user message
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })

    // Update chat title if it's the first message
    if (state.currentChat.messages.length === 0) {
      const title = input.trim().slice(0, 50) + (input.trim().length > 50 ? '...' : '')
      dispatch({ 
        type: 'UPDATE_CHAT_TITLE', 
        payload: { chatId: state.currentChat.id, title } 
      })
    }

    setInput('')
    dispatch({ type: 'SET_GENERATING', payload: true })

    try {
      // API call to our mock server
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.trim(),
          businessName: "Business Name",
          shortDescription: input.trim(),
          targetMarket: "target audience"
        })
      })

      if (!response.ok) throw new Error('Stream failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      // Create initial AI message structure
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        responses: [
          {
            type: 'pitch_summary',
            title: 'Response 1 — Pitch Summary',
            content: ''
          },
          {
            type: 'audience_marketing',
            title: 'Response 2 — Target Audience & Marketing',
            content: ''
          },
          {
            type: 'landing_page',
            title: 'Response 3 — Landing Page + Code',
            content: '',
            code: '',
            features: ''
          }
        ],
        isComplete: false
      }

      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage })

      let buffer = ''
      let currentSection = 'A'

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.section === 'DONE') {
                dispatch({ 
                  type: 'UPDATE_LAST_MESSAGE', 
                  payload: { content: '', isComplete: true } 
                })
                dispatch({ type: 'SET_GENERATING', payload: false })
                return
              }

              if (data.section === 'A') currentSection = 'pitch_summary'
              else if (data.section === 'B') currentSection = 'audience_marketing'
              else if (data.section === 'C') currentSection = 'landing_page'

              // Update the appropriate section content
              const lastMessage = state.currentChat.messages[state.currentChat.messages.length - 1]
              if (lastMessage && lastMessage.responses) {
                const responseIndex = lastMessage.responses.findIndex(r => r.type === currentSection)
                if (responseIndex !== -1) {
                  const updatedResponses = [...lastMessage.responses]
                  if (currentSection === 'landing_page' && data.type === 'code') {
                    updatedResponses[responseIndex].code += data.content
                  } else {
                    updatedResponses[responseIndex].content += data.content
                  }
                  
                  dispatch({ 
                    type: 'UPDATE_LAST_MESSAGE', 
                    payload: { 
                      content: '', 
                      responses: updatedResponses,
                      isComplete: false 
                    } 
                  })
                }
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback to mock response if stream fails
      simulateMockResponse(input.trim())
    }
  }

  const simulateMockResponse = (prompt) => {
    // Create a mock AI response
    const mockResponses = [
      {
        type: 'pitch_summary',
        title: 'Response 1 — Pitch Summary',
        content: `Based on your idea "${prompt}", here's a compelling pitch:\n\nHeading: Innovative Solution\nTagline: Revolutionizing the way people interact\n\nBusiness Model: Subscription-based with premium features\nExecution Plan: 8-week launch timeline\nSuggestions: Focus on user acquisition and retention`
      },
      {
        type: 'audience_marketing',
        title: 'Response 2 — Target Audience & Marketing',
        content: `Target Audience:\n1. Tech-savvy professionals aged 25-40\n2. Small business owners\n3. Digital natives\n\nMarketing Strategy:\n- Social media campaigns\n- Content marketing\n- Partnership programs\n\nKPIs: User acquisition cost, retention rate, customer lifetime value`
      },
      {
        type: 'landing_page',
        title: 'Response 3 — Landing Page + Code',
        content: 'Hero section with compelling headline and clear value proposition. Feature highlights and social proof. Strong call-to-action buttons.',
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Your Amazing Product</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Your Amazing Product</h1>
      <p class="text-xl text-gray-600 mb-8">Revolutionizing the way people do things</p>
      <button class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Get Started
      </button>
    </div>
  </div>
</body>
</html>`,
        features: '• Clean, modern design\n• Mobile-responsive layout\n• Fast loading times\n• SEO-optimized structure\n• Accessibility features'
      }
    ]

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      responses: mockResponses,
      isComplete: true
    }

    dispatch({ type: 'ADD_MESSAGE', payload: aiMessage })
    dispatch({ type: 'SET_GENERATING', payload: false })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={`border-t p-4 ${
      state.darkMode 
        ? 'border-gray-700 bg-gray-800' 
        : 'border-gray-200 bg-white'
    }`}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your pitch idea here..."
              disabled={state.isGenerating}
              rows={1}
              className={`w-full resize-none rounded-lg px-4 py-3 pr-12 custom-scrollbar transition-colors duration-200 ${
                state.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } border focus:outline-none focus:ring-2 focus:ring-purple-200`}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 top-3">
              <svg 
                className={`w-4 h-4 ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || state.isGenerating}
            className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
              input.trim() && !state.isGenerating
                ? state.darkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                  : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                : state.darkMode
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {state.isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>
        <div className={`text-xs text-center mt-2 ${
          state.darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

export default InputBar