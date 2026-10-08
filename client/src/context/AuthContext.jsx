import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) { api.defaults.headers.common['Authorization'] = `Bearer ${token}`; fetchUser() }
    else setLoading(false)
  }, [])

  const fetchUser = async () => {
    try { const { data } = await api.get('/auth/me'); setUser(data.user) }
    catch { logout() }
    finally { setLoading(false) }
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token); setUser(data.user); return data
  }

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    localStorage.setItem('token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token); setUser(data.user); return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null); setUser(null)
  }

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  return (
    <AuthContext.Provider value={{
      user, loading, token, login, register, logout, updateUser,
      isAdmin: user?.role === 'admin', isOwner: user?.role === 'owner', isBuyer: user?.role === 'buyer'
    }}>
      {children}
    </AuthContext.Provider>
  )
}
