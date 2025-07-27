import { Bars3Icon, MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useState } from "react"
import { Link } from "react-router"
import { useSupabase } from "../../hooks/useSupabase"
import { useTheme } from "../../hooks/useTheme"
import SideMenu from "../molecules/SideMenu"

const Header: React.FC = () => {
  const { user } = useSupabase()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setIsMenuOpen(true)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="bg-base-100 shadow-lg fixed top-0 left-0 right-0 z-20">
        <div className="navbar max-w-2xl w-full mx-auto">
          <div className="navbar-start">
            {user && (
              <button
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={handleMenuClick}
                aria-label="Menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="navbar-center">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              <Link to="/">Tater 🎙️ Talk</Link>
            </h1>
          </div>
          <div className="navbar-end">
            <button
              type="button"
              className="btn btn-ghost btn-circle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {user && <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />}
    </>
  )
}

export default Header
