import { useEffect, useState } from "react"

export const useTheme = () => {
  // Get initial theme from localStorage or document attribute
  const getInitialTheme = (): boolean => {
    const savedTheme = localStorage.getItem("theme")
    const documentTheme = document.documentElement.getAttribute("data-theme")
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches

    // Priority: localStorage > document attribute > system preference
    const theme =
      savedTheme || documentTheme || (prefersDark ? "dark" : "light")
    return theme === "dark"
  }

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)

  useEffect(() => {
    // Update document theme when isDarkMode changes
    const html = document.documentElement
    if (isDarkMode) {
      html.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.setAttribute("data-theme", "light")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return {
    isDarkMode,
    toggleTheme,
  }
}
