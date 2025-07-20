import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import type React from "react"
import { useState } from "react"
import { useSupabase } from "../../hooks/useSupabase"
import LoginForm from "../molecules/LoginForm"
import SignupForm from "../molecules/SignupForm"

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)
  const { user, error, success, clearMessages } = useSupabase()

  const handleSwitchToSignup = () => {
    setIsLogin(false)
    clearMessages()
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    clearMessages()
  }

  // If user is already authenticated, redirect to main page
  if (user) {
    return null // This will be handled by the parent component
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-2 sm:p-4">
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
  )
}

export default AuthPage
