import {
  ArrowPathIcon,
  MicrophoneIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import { useAtom, useAtomValue } from "jotai"
import type React from "react"
import { useEffect, useRef } from "react"
import { textAreaAtom } from "../../atoms/textAreaAtom"
import { themeAtom } from "../../atoms/themeAtom"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { taterMachine } from "../../lang/speechLogic"
import { themedToastError } from "../../lib/themedToast"
import ActionButton from "../atoms/ActionButton"
import TextArea from "../atoms/TextArea"

const MainPage: React.FC = () => {
  const [text, setText] = useAtom(textAreaAtom)
  const theme = useAtomValue(themeAtom)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to the end of the text area if necessary
  useEffect(() => {
    const setupTextArea = (textArea: HTMLTextAreaElement) => {
      const length = textArea.value.length
      textArea.setSelectionRange(length, length)
      textArea.focus()
    }

    const textArea = textAreaRef.current
    if (textArea) {
      setupTextArea(textArea)
    } else {
      setTimeout(() => {
        setupTextArea(textAreaRef.current!)
      }, 1000)
    }
  }, [])

  const { isLoading, isListening, errorMsg, start, stop } =
    useSpeechRecognition({
      textAreaRef,
      speechRecognitionMachine: taterMachine,
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
    <>
      <TextArea value={text} onChange={setText} ref={textAreaRef} />

      <div className="flex gap-4 mt-6 justify-center">
        <ActionButton
          onClick={isListening ? stop : start}
          className={
            isListening ? "btn-error xs:btn-lg" : "btn-primary xs:btn-lg"
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
          className={clsx("btn-soft xs:btn-lg", {
            "text-white": theme === "light" && !text,
          })}
          disabled={!text}
          icon={<ScissorsIcon className="w-6 h-6" />}
        >
          Cut Text
        </ActionButton>
      </div>
    </>
  )
}

export default MainPage
