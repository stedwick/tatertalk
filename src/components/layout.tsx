import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { useSupabase } from "../hooks/useSupabase"
import Header from "./atoms/Header"
import MountainBackground from "./atoms/MountainBackground"
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
      <MountainBackground className="fixed inset-0 z-0" />
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
