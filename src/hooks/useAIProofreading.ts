import { useAtom } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import { aiProofreadingEnabledAtom } from "../atoms/aiProofreadingAtom"
import { getSettings } from "../lib/settings"
import { readFromTextArea, writeToTextArea } from "../lib/textarea"

interface UseAIProofreadingProps {
  textAreaRef?: React.RefObject<HTMLTextAreaElement>
  isListening?: boolean
  onTextUpdate?: (text: string) => void
}

export const useAIProofreading = (props: UseAIProofreadingProps = {}) => {
  const { textAreaRef, isListening, onTextUpdate } = props
  const [isEnabled, setIsEnabled] = useAtom(aiProofreadingEnabledAtom)
  const [canEnable, setCanEnable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wasListeningRef = useRef(false)

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
  }, [isEnabled, setIsEnabled])

  const proofreadText = useCallback(
    async (text: string): Promise<string> => {
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
              model: "openai/gpt-4.1-mini",
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
    },
    [isEnabled, canEnable],
  )

  // Handle automatic proofreading when speech recognition stops
  useEffect(() => {
    const handleAutoProofreading = async () => {
      // Check if isListening changed from true to false
      if (
        wasListeningRef.current &&
        !isListening &&
        isEnabled &&
        textAreaRef?.current
      ) {
        const context = readFromTextArea(textAreaRef.current)
        const fullText = `${context.before}${context.text}${context.after}`

        if (fullText.trim()) {
          const proofreadResult = await proofreadText(fullText)

          if (proofreadResult !== fullText) {
            // Update the text area with the proofread text
            writeToTextArea(textAreaRef.current, {
              before: proofreadResult,
              text: "",
              after: "",
            })
            // Call the callback to update React state
            onTextUpdate?.(proofreadResult)
          }
        }
      }

      // Update the ref for next comparison
      wasListeningRef.current = isListening || false
    }

    handleAutoProofreading()
  }, [isListening, isEnabled, textAreaRef, onTextUpdate, proofreadText])

  return {
    isEnabled,
    setIsEnabled,
    canEnable,
    isLoading,
    proofreadText,
  }
}
