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
import { useAIProofreading } from "../../hooks/useAIProofreading"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { taterMachine } from "../../lang/speechLogic"
import { themedToastError } from "../../lib/themedToast"
import ActionButton from "../atoms/ActionButton"
import AIProofreadingToggle from "../atoms/AIProofreadingToggle"
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

  // Use AI proofreading hook with all necessary props
  const aiProofreading = useAIProofreading({
    textAreaRef,
    isListening,
    onTextUpdate: setText,
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
      <div className="relative flex flex-col flex-1 w-full">
        <TextArea value={text} onChange={setText} ref={textAreaRef} />

        <AIProofreadingToggle
          className="md:mt-4 absolute md:relative bottom-2 left-2 md:bottom-auto md:left-auto bg-base-100/90 md:bg-transparent rounded-lg md:rounded-none p-1 md:p-0"
          isEnabled={aiProofreading.isEnabled}
          setIsEnabled={aiProofreading.setIsEnabled}
          canEnable={aiProofreading.canEnable}
          isLoading={aiProofreading.isLoading}
        />
      </div>

      <div className="flex flex-col xxs:flex-row gap-4 mt-4 justify-center">
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
