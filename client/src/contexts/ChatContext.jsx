import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext'

const ChatContext = createContext()

// Action types
const ACTION_TYPES = {
  SET_ROOMS: 'SET_ROOMS',
  SET_USERS: 'SET_USERS',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_CURRENT_ROOM: 'SET_CURRENT_ROOM',
  SET_TYPING_USERS: 'SET_TYPING_USERS',
  SET_UNREAD_COUNTS: 'SET_UNREAD_COUNTS',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_LOADING: 'SET_LOADING'
}

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ROOMS:
      return { ...state, rooms: action.payload }
    
    case ACTION_TYPES.SET_USERS:
      return { ...state, users: action.payload }
    
    case ACTION_TYPES.SET_MESSAGES:
      return { 
        ...state, 
        messages: { 
          ...state.messages, 
          [action.payload.room]: action.payload.messages 
        } 
      }
    
    case ACTION_TYPES.ADD_MESSAGE:
      const room = action.payload.room || state.currentRoom
      const roomMessages = state.messages[room] || []
      return {
        ...state,
        messages: {
          ...state.messages,
          [room]: [...roomMessages, action.payload.message]
        }
      }
    
    case ACTION_TYPES.SET_CURRENT_ROOM:
      return { ...state, currentRoom: action.payload }
    
    case ACTION_TYPES.SET_TYPING_USERS:
      return { ...state, typingUsers: action.payload }
    
    case ACTION_TYPES.SET_UNREAD_COUNTS:
      return { ...state, unreadCounts: action.payload }
    
    case ACTION_TYPES.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
    
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    default:
      return state
  }
}

const initialState = {
  rooms: [],
  users: [],
  messages: {},
  currentRoom: 'general',
  typingUsers: [],
  unreadCounts: new Map(),
  searchResults: [],
  isLoading: false
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { socket } = useSocket()
  const { user } = useAuth()

  useEffect(() => {
    if (!socket || !user) return

    // Socket event listeners
    const handleJoinSuccess = (data) => {
      dispatch({ type: ACTION_TYPES.SET_ROOMS, payload: data.rooms })
      dispatch({ type: ACTION_TYPES.SET_USERS, payload: data.users })
      dispatch({ 
        type: ACTION_TYPES.SET_MESSAGES, 
        payload: { room: data.currentRoom.name, messages: data.messageHistory } 
      })
    }

    const handleNewMessage = (message) => {
      dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: { message } })
    }

    const handleUserTyping = (data) => {
      if (data.room === state.currentRoom) {
        dispatch({ 
          type: ACTION_TYPES.SET_TYPING_USERS, 
          payload: data.isTyping 
            ? [...state.typingUsers.filter(u => u !== data.username), data.username]
            : state.typingUsers.filter(u => u !== data.username)
        })
      }
    }

    const handleUsersUpdated = (users) => {
      dispatch({ type: ACTION_TYPES.SET_USERS, payload: users })
    }

    // Register event listeners
    socket.on('join_success', handleJoinSuccess)
    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleUserTyping)
    socket.on('users_updated', handleUsersUpdated)

    // Join chat after connection
    socket.emit('user_join', { username: user.username })

    return () => {
      socket.off('join_success', handleJoinSuccess)
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleUserTyping)
      socket.off('users_updated', handleUsersUpdated)
    }
  }, [socket, user, state.currentRoom])

  const joinRoom = (roomName) => {
    if (socket) {
      socket.emit('join_room', { roomName })
      dispatch({ type: ACTION_TYPES.SET_CURRENT_ROOM, payload: roomName })
      // Clear typing indicators when changing rooms
      dispatch({ type: ACTION_TYPES.SET_TYPING_USERS, payload: [] })
    }
  }

  const sendMessage = (content, room = state.currentRoom) => {
    if (socket && content.trim()) {
      socket.emit('chat_message', { 
        message: content, 
        room 
      })
    }
  }

  const sendTyping = (isTyping, room = state.currentRoom) => {
    if (socket) {
      socket.emit('typing', { isTyping, room })
    }
  }

  const value = {
    ...state,
    joinRoom,
    sendMessage,
    sendTyping,
    dispatch
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}