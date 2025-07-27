import {
  ArrowPathIcon,
  MicrophoneIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { useTheme } from "../../hooks/useTheme"
import { azureSpeechMachine } from "../../lang/providers/azure"
import { themedToastError } from "../../lib/themedToast"
import ActionButton from "../atoms/ActionButton"
import TextArea from "../atoms/TextArea"

const MainPage: React.FC = () => {
  const [text, setText] = useState("")
  const { theme } = useTheme()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const { isLoading, isListening, errorMsg, start, stop } =
    useSpeechRecognition({
      textAreaRef,
      recognizerMachine: azureSpeechMachine,
    })

  useEffect(() => {
    if (errorMsg) {
      themedToastError(errorMsg)
    }
  }, [errorMsg])

  const handleCutText = () => {
    if (text) {
      navigator.clipboard.writeText(text)
      setText("")
      stop()
      console.log("Text cut to clipboard")
    }
  }

  return (
    <div className="flex-1 px-4 py-6 pt-22 flex flex-col relative">
      <div className="flex-1 flex flex-col z-10 max-w-2xl w-full mx-auto">
        <TextArea value={text} onChange={setText} ref={textAreaRef} />
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <ActionButton
          onClick={isListening ? stop : start}
          className={
            isListening ? "btn-error sm:btn-lg" : "btn-primary sm:btn-lg"
          }
          icon={
            isLoading ? (
              <ArrowPathIcon className="w-6 h-6 animate-spin" />
            ) : (
              <MicrophoneIcon className="w-6 h-6" />
            )
          }
          isAnimating={isListening}
          disabled={isLoading}
        >
          {isListening ? "Stop Dictation" : "Start Dictation"}
        </ActionButton>

        <ActionButton
          onClick={handleCutText}
          className={clsx("btn-soft sm:btn-lg", {
            "text-white": theme === "light" && !text,
          })}
          disabled={!text}
          icon={<ScissorsIcon className="w-6 h-6" />}
        >
          Cut Text
        </ActionButton>
      </div>
    </div>
  )
}

export default MainPage
