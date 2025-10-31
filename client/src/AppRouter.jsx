import React, { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'
import Login from './pages/Login'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

const AppRouter = () => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Login />
  }

  // In a real app, you'd use React Router here
  return <Chat />
}

export default AppRouter