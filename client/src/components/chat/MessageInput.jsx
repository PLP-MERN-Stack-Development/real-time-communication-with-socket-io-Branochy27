import React, { useState, useRef } from 'react'
import { useChat } from '../../contexts/ChatContext'
import FileUpload from './FileUpload'
import '../../styles/components/chat/MessageInput.css'

const MessageInput = ({ onSendMessage, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef(null)
  const { sendMessage, sendTyping, currentRoom } = useChat()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const finalSendMessage = onSendMessage || sendMessage
    finalSendMessage(message.trim())
    setMessage('')
    stopTyping()
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setMessage(value)

    if (value.trim() && !isTyping) {
      startTyping()
    } else if (!value.trim() && isTyping) {
      stopTyping()
    }
  }

  const startTyping = () => {
    setIsTyping(true)
    sendTyping(true, currentRoom)
  }

  const stopTyping = () => {
    setIsTyping(false)
    sendTyping(false, currentRoom)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileUpload = (file) => {
    console.log('File uploaded:', file)
    // Handle file upload logic here
  }

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="input-container">
        <button
          type="button"
          className="file-upload-button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload file"
        >
          📎
        </button>

        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onBlur={stopTyping}
          placeholder={placeholder}
          className="message-textarea"
          rows="1"
        />

        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>

      <FileUpload
        ref={fileInputRef}
        onFileSelect={handleFileUpload}
      />
    </form>
  )
}

export default MessageInput