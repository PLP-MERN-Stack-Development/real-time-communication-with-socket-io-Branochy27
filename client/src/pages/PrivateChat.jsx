import React, { useState } from 'react'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/layout/Header'
import MessageList from '../components/chat/messageList'
import MessageInput from '../components/chat/messageInput'
import '../styles/pages/PrivateChat.css'

const PrivateChat = ({ otherUser }) => {
  const [privateMessages, setPrivateMessages] = useState([])
  const { user } = useAuth()

  const sendPrivateMessage = (content) => {
    // Implementation for private messaging
    console.log('Sending private message to', otherUser, ':', content)
  }

  return (
    <div className="private-chat-page">
      <Header 
        title={`Private Chat with ${otherUser}`}
        showBackButton={true}
      />
      
      <div className="private-chat-content">
        <MessageList 
          messages={privateMessages}
          currentUser={user}
          isPrivate={true}
        />
        
        <MessageInput 
          onSendMessage={sendPrivateMessage}
          placeholder={`Message ${otherUser}...`}
        />
      </div>
    </div>
  )
}

export default PrivateChat