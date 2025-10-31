import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/pages/NotFound.css'

const NotFound = () => {
  const { user } = useAuth()

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <p>Page not found</p>
        {user ? (
          <a href="/" className="back-link">Return to Chat</a>
        ) : (
          <a href="/" className="back-link">Return to Login</a>
        )}
      </div>
    </div>
  )
}

export default NotFound