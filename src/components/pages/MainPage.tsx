import { MicrophoneIcon, ScissorsIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useState } from "react"
import ActionButton from "../atoms/ActionButton"
import Header from "../atoms/Header"
import TextArea from "../atoms/TextArea"
import SideMenu from "../molecules/SideMenu"

interface MainPageProps {
  isDarkMode: boolean
  onThemeToggle: () => void
}

const MainPage: React.FC<MainPageProps> = ({ isDarkMode, onThemeToggle }) => {
  const [text, setText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setIsMenuOpen(true)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

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
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header
        onMenuClick={handleMenuClick}
        onThemeToggle={onThemeToggle}
        isDarkMode={isDarkMode}
      />

      <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

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
    </div>
  )
}

export default MainPage
