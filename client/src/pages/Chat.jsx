import React from 'react'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import MessageList from '../components/chat/messageList'
import MessageInput from '../components/chat/messageInput'
import ConnectionStatus from '../components/common/ConnectionStatus'
import '../styles/pages/Chat.css'

const Chat = () => {
  const { currentRoom, messages, typingUsers } = useChat()
  const { user } = useAuth()

  const currentMessages = messages[currentRoom] || []

  return (
    <div className="chat-page">
      <ConnectionStatus />
      
      <div className="chat-layout">
        <Sidebar />
        
        <div className="chat-main">
          <Header />
          
          <div className="chat-content">
            <MessageList 
              messages={currentMessages}
              currentUser={user}
            />
            
            <div className="chat-footer">
              <MessageInput />
              {typingUsers.length > 0 && (
                <div className="typing-container">
                  <span className="typing-text">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat