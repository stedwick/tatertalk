import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { themeAtom } from "../atoms/themeAtom"

export const ThemeListener = () => {
  const [theme] = useAtomValue(themeAtom)

  useEffect(() => {
    // Update document theme when theme changes
    const html = document.documentElement
    html.setAttribute("data-theme", theme)
  }, [theme])

  return null
}
