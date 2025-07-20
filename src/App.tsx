import { useEffect } from "react"
import AuthPage from "./components/pages/AuthPage"
import MainPage from "./components/pages/MainPage"
import { useTheme } from "./hooks/useTheme"
import { useAuthStore } from "./lib/authStore"
import { supabase } from "./lib/supabase"
import "./App.css"

function App() {
  const { user, session, loading, setUser, setSession, setLoading } =
    useAuthStore()
  const { isDarkMode, toggleTheme } = useTheme()

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return user && session ? (
    <MainPage isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
  ) : (
    <AuthPage isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
  )
}

export default App
