// import { useEffect } from "react"
import { Outlet } from "react-router"
import { useSupabase } from "../hooks/useSupabase"
import Header from "./atoms/Header"
import MountainBackground from "./atoms/MountainBackground"
import LoadingPage from "./pages/LoadingPage"

export default function Layout() {
  const { user: _user, loading } = useSupabase()
  // const navigate = useNavigate()

  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate("/login")
  //   }
  // }, [loading, navigate, user])

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <MountainBackground className="fixed inset-0 z-0" />
      <div className="flex-1 px-4 py-6 pt-22 flex flex-col relative">
        <div className="flex-1 flex flex-col z-10 max-w-2xl w-full mx-auto">
          {loading ? (
            <LoadingPage />
          ) : (
            <>
              <Header />
              <Outlet />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
