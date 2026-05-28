import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { API_URL, buildHeaders } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user, isLoading, isAuthenticated, logout: auth0Logout, getAccessTokenSilently } = useAuth0()
  const [role, setRole] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchRole()
    } else {
      setRole(null)
    }
  }, [isAuthenticated])

  const fetchRole = async () => {
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_URL}/candidate/me`, { headers: buildHeaders(token) })
      if (res.ok) {
        const data = await res.json()
        setRole(data.user?.role || 'candidate')
      }
    } catch {
      setRole('candidate')
    }
  }

  const logout = () => auth0Logout({ logoutParams: { returnTo: window.location.origin } })

  const getToken = async () => {
    try { return await getAccessTokenSilently() }
    catch { return null }
  }

  return (
    <AuthContext.Provider value={{
      user: isAuthenticated ? user : null,
      loading: isLoading,
      isAuthenticated,
      role,
      logout,
      getToken,
    }}>
      {isLoading ? (
        <div className="route-loading">
          <div className="route-loading__spinner" />
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}