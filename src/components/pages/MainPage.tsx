import { MicrophoneIcon, ScissorsIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useState } from "react"
import ActionButton from "../atoms/ActionButton"
import TextArea from "../atoms/TextArea"

interface MainPageProps {
  initialText?: string
}

const MainPage: React.FC<MainPageProps> = ({ initialText = "" }) => {
  const [text, setText] = useState(initialText)
  const [isRecording, setIsRecording] = useState(false)

  const handleStartDictation = () => {
    setIsRecording(true)
    // TODO: Implement speech recognition
    console.log("Starting dictation...")
  }

  const handleStopDictation = () => {
    setIsRecording(false)
    // TODO: Stop speech recognition
    console.log("Stopping dictation...")
  }

  const handleCutText = () => {
    if (text) {
      navigator.clipboard.writeText(text)
      setText("")
      console.log("Text cut to clipboard")
    }
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
      <div className="flex-1 flex flex-col">
        <TextArea value={text} onChange={setText} />
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <ActionButton
          onClick={isRecording ? handleStopDictation : handleStartDictation}
          className={
            isRecording
              ? "btn-error sm:btn-lg"
              : "btn-outline btn-primary sm:btn-lg"
          }
          icon={<MicrophoneIcon className="w-6 h-6" />}
          isAnimating={isRecording}
        >
          {isRecording ? "Stop Dictation" : "Start Dictation"}
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
