/* eslint-disable react-refresh/only-export-components -- this file intentionally exports the useAuth hook alongside the provider, same shape as the original AuthContext.jsx */
import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  isLoggedIn: boolean
  loggedIn: () => void
  loggedOf: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loggedIn = () => setIsLoggedIn(true)
  const loggedOf = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('e-api-token') // added clear Localstorage when Logout is clicked
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loggedIn, loggedOf }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
