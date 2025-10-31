import React, { useState } from 'react'
import ReactionPicker from './ReactionPicker'
import '../../styles/components/chat/Message.css'

const Message = ({ message, isOwn, showAvatar }) => {
  const [showReactions, setShowReactions] = useState(false)

  const handleReaction = (reaction) => {
    console.log('Reacted with:', reaction, 'to message:', message.id)
    setShowReactions(false)
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderContent = () => {
    if (message.type === 'system') {
      return (
        <div className="message-system">
          <span>{message.content}</span>
        </div>
      )
    }

    if (message.type === 'file') {
      return (
        <div className="message-file">
          <div className="file-icon">📎</div>
          <a 
            href={message.file?.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="file-link"
          >
            {message.file?.name}
          </a>
          <span className="file-size">
            ({formatFileSize(message.file?.size)})
          </span>
        </div>
      )
    }

    return <div className="message-text">{message.content}</div>
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (message.type === 'system') {
    return (
      <div className="message system-message">
        {renderContent()}
      </div>
    )
  }

  return (
    <div className={`message ${isOwn ? 'own-message' : 'other-message'}`}>
      {showAvatar && !isOwn && (
        <img 
          src={message.user?.avatar} 
          alt={message.user?.username}
          className="message-avatar"
        />
      )}
      
      <div className="message-content">
        {!isOwn && showAvatar && (
          <div className="message-username">
            {message.user?.username || message.username}
          </div>
        )}
        
        <div 
          className="message-bubble"
          onDoubleClick={() => setShowReactions(!showReactions)}
        >
          {renderContent()}
          <div className="message-time">
            {formatTime(message.timestamp || message.createdAt)}
          </div>
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="message-reactions">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="reaction">
                {reaction.emoji} {reaction.users?.length || 0}
              </span>
            ))}
          </div>
        )}

        {showReactions && (
          <ReactionPicker onSelectReaction={handleReaction} />
        )}
      </div>
    </div>
  )
}

export default Message