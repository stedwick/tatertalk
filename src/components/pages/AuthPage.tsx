import React, { useState, useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import LoginForm from '../molecules/LoginForm'
import SignupForm from '../molecules/SignupForm'
import { useAuthStore } from '../../lib/authStore'
import { supabase } from '../../lib/supabase'

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { user, session, loading, setUser, setSession, setLoading, error, clearError } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading])

  const handleSwitchToSignup = () => {
    setIsLogin(false)
    clearError()
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    clearError()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  // If user is already authenticated, redirect to main page
  if (user && session) {
    return null // This will be handled by the parent component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="alert alert-error mb-4">
            <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6" />
            <span>{error}</span>
          </div>
        )}
        
        {isLogin ? (
          <LoginForm onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    </div>
  )
}

export default AuthPage 