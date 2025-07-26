import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useSupabase } from "../../hooks/useSupabase"

const LogoutPage: React.FC = () => {
  const { supabase } = useSupabase()
  const navigate = useNavigate()
  useEffect(() => {
    supabase.auth.signOut().then(() => {
      navigate("/login")
    })
  }, [supabase, navigate])
  return null
}

export default LogoutPage
