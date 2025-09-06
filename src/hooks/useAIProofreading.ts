import { useEffect, useState } from "react"
import { getSettings } from "../lib/settings"

export const useAIProofreading = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [canEnable, setCanEnable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check settings on mount and when they might change
    const checkSettings = () => {
      const settings = getSettings()
      const hasRequiredSettings = !!(
        settings.openRouterApiKey && settings.aiProofreadingPrompt
      )
      setCanEnable(hasRequiredSettings)

      // Disable if settings are removed
      if (!hasRequiredSettings && isEnabled) {
        setIsEnabled(false)
      }
    }

    checkSettings()

    // Listen for storage changes (when settings are updated in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tatertalk_settings") {
        checkSettings()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check when window gains focus (in case settings changed in same tab)
    const handleFocus = () => checkSettings()
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [isEnabled])

  const proofreadText = async (text: string): Promise<string> => {
    if (!isEnabled || !canEnable) {
      return text
    }

    setIsLoading(true)

    try {
      const settings = getSettings()
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${settings.openRouterApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.2-3b-instruct:free",
            messages: [
              {
                role: "system",
                content: settings.aiProofreadingPrompt,
              },
              {
                role: "user",
                content: text,
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        console.error("AI proofreading failed:", response.statusText)
        return text
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || text
    } catch (error) {
      console.error("AI proofreading error:", error)
      return text
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isEnabled,
    setIsEnabled,
    canEnable,
    isLoading,
    proofreadText,
  }
}
