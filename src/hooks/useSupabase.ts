import type { Session, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [signInLoading, setSignInLoading] = useState(false)
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
  }, [])

  const signIn = async (email: string, password: string) => {
    setError(null)
    setSuccess(null)
    setSignInLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error.message)
      }
      return { error }
    } finally {
      setSignInLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setError(null)
    setSuccess(null)
    setSignUpLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess("Check your email for the confirmation link!")
      }
      return { error }
    } finally {
      setSignUpLoading(false)
    }
  }

  const signOut = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
    }
    return { error }
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccess(null)
  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return {
    user,
    session,
    loading,
    signInLoading,
    signUpLoading,
    error,
    success,
    signIn,
    signUp,
    signOut,
    clearError,
    clearSuccess,
    clearMessages,
    supabase,
  }
}
