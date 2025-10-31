import React from 'react'
import { useChat } from '../../contexts/ChatContext'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/components/layout/Header.css'

const Header = ({ title, showBackButton = false }) => {
  const { currentRoom, rooms } = useChat()
  const { user, logout } = useAuth()

  const room = rooms.find(r => r.name === currentRoom)

  return (
    <div className="chat-header">
      <div className="header-left">
        {showBackButton && (
          <button className="back-button" onClick={() => window.history.back()}>
            ← Back
          </button>
        )}
        <h2>{title || (room ? room.displayName : currentRoom)}</h2>
        {room && (
          <span className="room-info">
            {room.users?.length || 0} users online
          </span>
        )}
      </div>

      <div className="header-right">
        <button 
          className="logout-button"
          onClick={logout}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Header