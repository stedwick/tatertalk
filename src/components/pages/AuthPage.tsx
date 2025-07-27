import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useSupabase } from "../../hooks/useSupabase"
import LoginForm from "../molecules/LoginForm"
import SignupForm from "../molecules/SignupForm"

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false)
  const { user, clearMessages } = useSupabase()
  const navigate = useNavigate()

  const handleSwitchToSignup = () => {
    setIsLogin(false)
    clearMessages()
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    clearMessages()
  }

  // If user is already authenticated, redirect to main page
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center mb-20 sm:mb-0">
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
