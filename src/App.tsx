import Header from "./components/atoms/Header"
import AuthPage from "./components/pages/AuthPage"
import MainPage from "./components/pages/MainPage"
import { useSupabase } from "./hooks/useSupabase"
import "./App.css"

function App() {
  const { user, loading } = useSupabase()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />

      {user ? <MainPage /> : <AuthPage />}
    </div>
  )
}

export default App
