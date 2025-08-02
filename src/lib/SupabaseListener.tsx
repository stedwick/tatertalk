import type { Session } from "@supabase/supabase-js"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { sessionAtom, userAtom, userLoadingAtom } from "../atoms/authAtoms"
import { supabase } from "./supabase"

export const SupabaseListener = () => {
  const setUser = useSetAtom(userAtom)
  const setSession = useSetAtom(sessionAtom)
  const setUserLoading = useSetAtom(userLoadingAtom)

  useEffect(() => {
    const updateSession = (session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
      setUserLoading(false)
    }
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setUser, setUserLoading])

  return null
}
