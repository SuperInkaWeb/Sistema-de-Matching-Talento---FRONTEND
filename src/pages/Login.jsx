import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const { role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'company') navigate('/dashboard', { replace: true })
      else if (role === 'admin') navigate('/admin', { replace: true })
      else navigate('/profile', { replace: true })
    }
  }, [isAuthenticated, role])

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({
        authorizationParams: { prompt: 'login' },
        appState: { returnTo: window.location.pathname }
      })
    }
  }, [])

  return (
    <div className="route-loading">
      <div className="route-loading__spinner" />
    </div>
  )
}