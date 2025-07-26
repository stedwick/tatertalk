import { useAtom } from "jotai"
import { useEffect } from "react"
import { themeAtom } from "../atoms/themeAtom"

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom)

  useEffect(() => {
    // Update document theme when theme changes
    const html = document.documentElement
    html.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
