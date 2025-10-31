import React from 'react'
import { useChat } from '../../contexts/ChatContext'
import { useAuth } from '../../contexts/AuthContext'
import RoomList from './RoomList'
import UserList from './UserList'
import '../../styles/components/layout/Sidebar.css'

const Sidebar = () => {
  const { user } = useAuth()
  const { rooms, users } = useChat()

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <img src={user.avatar} alt={user.username} className="user-avatar" />
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="user-status">🟢 Online</span>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        <RoomList rooms={rooms} />
        <UserList users={users} currentUser={user} />
      </div>
    </div>
  )
}

export default Sidebar