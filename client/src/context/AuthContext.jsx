import { createContext, useContext, useState } from 'react'
import api from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  async function register(name, email, password) {
    await api.post('/auth/register', { name, email, password })
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
  }

  async function logout() {
    try {
      await api.get('/auth/logout')
    } catch {
      // even if the server call fails, still log out on this side
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
