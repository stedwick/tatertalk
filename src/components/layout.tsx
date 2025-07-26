import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { useSupabase } from "../hooks/useSupabase"
import Header from "./atoms/Header"
import LoadingPage from "./pages/LoadingPage"

export default function Layout() {
  const { user, loading } = useSupabase()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [loading, navigate, user])

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  )
}
