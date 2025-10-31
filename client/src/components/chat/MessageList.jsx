import React, { useRef, useEffect } from 'react'
import Message from './message'
import '../../styles/components/chat/MessageList.css'

const MessageList = ({ messages, currentUser, isPrivate = false }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. Start the conversation! 💬</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message
            key={message.id || index}
            message={message}
            isOwn={message.user?.id === currentUser.id || message.username === currentUser.username}
            showAvatar={index === 0 || messages[index - 1]?.user?.id !== message.user?.id}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList