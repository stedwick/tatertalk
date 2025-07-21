import { ArrowPathIcon, PlayIcon, StopIcon } from "@heroicons/react/24/solid"
import type React from "react"
import { useRef } from "react"
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition"

const SpeechRecognitionTest: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const { isLoading, isListening, errorMsg, speechActor } =
    useSpeechRecognition({
      textAreaRef,
    })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-base-content">
            Speech Recognition
          </h2>
        </div>

        {errorMsg && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Error</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="form-control">
          <label htmlFor="transcription" className="label">
            <span className="label-text">Transcription</span>
          </label>
          <textarea
            id="transcription"
            ref={textAreaRef}
            className="textarea textarea-bordered h-48 resize-none"
            placeholder="The transcription will appear here..."
            readOnly
          />
          <label htmlFor="transcription" className="label">
            <span className="label-text-alt">
              Using Microsoft Azure Speech to Text for Real Time Transcription
            </span>
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          {isLoading ? (
            <button type="button" className="btn btn-secondary" disabled>
              <ArrowPathIcon className="h-5 w-5" />
              Loading...
            </button>
          ) : isListening ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => speechActor.send({ type: "stop" })}
            >
              <StopIcon className="h-5 w-5" />
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => speechActor.send({ type: "start" })}
            >
              <PlayIcon className="h-5 w-5" />
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpeechRecognitionTest
