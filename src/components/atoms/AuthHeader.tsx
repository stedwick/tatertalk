import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import type React from "react"

interface AuthHeaderProps {
  onThemeToggle: () => void
  isDarkMode: boolean
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  onThemeToggle,
  isDarkMode,
}) => {
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">{/* Empty div to maintain layout */}</div>
      <div className="navbar-center">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Tater 🎙️ Talk
        </h1>
      </div>
      <div className="navbar-end">
        <button
          type="button"
          className="btn btn-ghost btn-circle"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  )
}

export default AuthHeader
