import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { signOut } from "../../lib/auth"

const LogoutPage: React.FC = () => {
  const navigate = useNavigate()
  useEffect(() => {
    signOut().then(() => {
      navigate("/")
    })
  }, [navigate])
  return null
}

export default LogoutPage
