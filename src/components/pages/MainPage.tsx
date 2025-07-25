import {
  ArrowPathIcon,
  MicrophoneIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline"
import type React from "react"
import { useRef, useState } from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"
import { azureSpeechMachine } from "../../lang/providers/azure"
import ActionButton from "../atoms/ActionButton"
import TextArea from "../atoms/TextArea"

const MainPage: React.FC = () => {
  const [text, setText] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const { isLoading, isListening, errorMsg, start, stop } =
    useSpeechRecognition({
      textAreaRef,
      recognizerMachine: azureSpeechMachine,
    })

  const handleCutText = () => {
    if (text) {
      navigator.clipboard.writeText(text)
      setText("")
      stop()
      console.log("Text cut to clipboard")
    }
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
      <div className="flex-1 flex flex-col">
        <TextArea value={text} onChange={setText} ref={textAreaRef} />
        {errorMsg && (
          <div className="alert alert-error mt-4">
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <ActionButton
          onClick={isListening ? stop : start}
          className={
            isListening
              ? "btn-error sm:btn-lg"
              : "btn-outline btn-primary sm:btn-lg"
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
          className="btn-outline sm:btn-lg"
          disabled={!text}
          icon={<ScissorsIcon className="w-6 h-6" />}
        >
          Cut Text
        </ActionButton>
      </div>
    </main>
  )
}

export default MainPage
