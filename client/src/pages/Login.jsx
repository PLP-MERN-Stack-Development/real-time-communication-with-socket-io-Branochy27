import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/pages/Login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long')
      return
    }

    const result = await login(username.trim())
    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🚀 Ultimate Chat</h1>
          <p>Join the most advanced real-time chat experience</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              maxLength={20}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? 'Joining...' : 'Join Chat 🎉'}
          </button>
        </form>

        <div className="feature-showcase">
          <h3>✨ Amazing Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <div className="feature-name">Multiple Rooms</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📨</div>
              <div className="feature-name">Private Messages</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✏️</div>
              <div className="feature-name">Typing Indicators</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📎</div>
              <div className="feature-name">File Sharing</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <div className="feature-name">Message Reactions</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <div className="feature-name">Smart Notifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login