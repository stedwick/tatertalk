import React, { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import LoginForm from '../molecules/LoginForm'
import SignupForm from '../molecules/SignupForm'
import AuthHeader from '../atoms/AuthHeader'
import { useAuthStore } from '../../lib/authStore'
import { supabase } from '../../lib/supabase'

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)
  const { user, session, loading, setUser, setSession, setLoading, error, success, clearMessages } = useAuthStore()
  
  // Theme management
  const savedTheme = document.documentElement.getAttribute('data-theme');
  const [isDarkMode, setIsDarkMode] = useState(savedTheme === 'dark');

  useEffect(() => {
    // Update document theme when isDarkMode changes
    const html = document.documentElement;
    if (isDarkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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
    clearMessages()
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    clearMessages()
  }

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col">
      <AuthHeader 
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center mb-20 sm:mb-0">
          {error && (
            <div className="alert alert-error mb-3 sm:mb-4">
              <ExclamationTriangleIcon className="stroke-current shrink-0 h-4 w-4 sm:h-6 sm:w-6" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-3 sm:mb-4">
              <CheckCircleIcon className="stroke-current shrink-0 h-4 w-4 sm:h-6 sm:w-6" />
              <span>{success}</span>
            </div>
          )}
          
          {isLogin ? (
            <LoginForm onSwitchToSignup={handleSwitchToSignup} />
          ) : (
            <SignupForm onSwitchToLogin={handleSwitchToLogin} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage 