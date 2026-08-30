
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)



export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loggedIn = () => setIsLoggedIn(true)
  const loggedOf = () => {setIsLoggedIn(false);    
    localStorage.removeItem('e-api-token');// added clear Localstorage when Logout is clicked
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


// // src/context/AuthContext.jsx
// import { createContext, useContext, useEffect, useState } from 'react'
// import { decodeToken } from '../utils/api'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {

//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const setLoggedIn = (value) => {
//     setIsLoggedIn(value)
//   }

// //   const [token, setToken] = useState(() => localStorage.getItem('e-api-token'))
// //   const user = token ? decodeToken(token) : null

// //   useEffect(() => {
// //     if (token) localStorage.setItem('e-api-token', token)
// //     else localStorage.removeItem('e-api-token')
// //   }, [token])

// //   const login = (newToken) => setToken(newToken)
// //   const logout = () => setToken(null)

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
//   return ctx
// }

