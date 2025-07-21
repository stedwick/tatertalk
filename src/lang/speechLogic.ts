/** biome-ignore-all lint/style/noNonNullAssertion: machine will error if not available */
import {
  AudioConfig,
  CancellationReason,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk"
import { assign, fromPromise, raise, setup } from "xstate"
import { getAzureCredentials } from "../lib/azureConfig"
import type { TextAreaContext } from "../lib/textarea"
import { readFromTextArea, writeToTextArea } from "../lib/textarea"

// Types for the speech recognition context and events
interface SpeechContext {
  isLoading: boolean
  isListening: boolean
  currentText: TextAreaContext
  recognizedText: TextAreaContext
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  audioStream: MediaStream | null
  speechRecognizer: SpeechRecognizer | null
  errorMsg: string | null
}

const initialContext: SpeechContext = {
  isLoading: false,
  isListening: false,
  currentText: { before: "", text: "", after: "" },
  recognizedText: { before: "", text: "", after: "" },
  textAreaRef: { current: null },
  audioStream: null,
  speechRecognizer: null,
  errorMsg: null,
} as const

const getInitialContext = () =>
  JSON.parse(JSON.stringify(initialContext)) as SpeechContext

type SpeechInput = { textAreaRef: React.RefObject<HTMLTextAreaElement> }

type SpeechEvents =
  | { type: "start" }
  | { type: "stop" }
  | { type: "recognizing"; text: string } // partial result
  | { type: "recognized"; text: string } // final result
  | { type: "error"; errorMsg: string }

// Actor for handling audio stream setup
const audioStreamActor = fromPromise(async () => {
  const constraints = {
    video: false,
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      sampleSize: 16,
      volume: 1,
    },
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    throw new Error(`Failed to get audio stream: ${error}`)
  }
})

// Actor for creating speech recognizer
const speechRecognizerActorAzure = fromPromise(
  async ({ input }: { input: MediaStream }) => {
    const mediaStream = input
    const credentials = getAzureCredentials()

    if (!credentials) {
      throw new Error(
        "Azure Speech Service credentials not configured. Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in localStorage.",
      )
    }

    const speechConfig = SpeechConfig.fromSubscription(
      credentials.key,
      credentials.region,
    )
    const audioConfig = AudioConfig.fromStreamInput(mediaStream)
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
    return recognizer
  },
)

// Main speech recognition machine
export const speechRecognitionImpl = setup({
  types: {
    input: {} as SpeechInput,
    context: {} as SpeechContext,
    events: {} as SpeechEvents,
  },
  actors: {
    audioStreamActor,
    speechRecognizerActor: speechRecognizerActorAzure,
  },
  actions: {
    read: assign({
      currentText: ({ context }) =>
        readFromTextArea(context.textAreaRef.current!),
    }),
    write: ({ context }) =>
      writeToTextArea(context.textAreaRef.current!, context.recognizedText),
    reset: assign({
      ...getInitialContext(),
      audioStream: ({ context }) => {
        if (context.audioStream) {
          context.audioStream.getTracks().forEach((track) => track.stop())
        }
        return null
      },
      speechRecognizer: ({ context }) => {
        if (context.speechRecognizer) {
          context.speechRecognizer.close()
        }
        return null
      },
      textAreaRef: ({ context }) => context.textAreaRef,
      errorMsg: ({ context }) => context.errorMsg,
    }),
  },
  guards: {
    hasTextAreaEl: ({ context }) => context.textAreaRef.current !== null,
  },
}).createMachine({
  id: "speechRecognition",
  context: ({ input }) => ({
    ...getInitialContext(),
    textAreaRef: input.textAreaRef,
  }),
  initial: "idle",
  on: {
    error: {
      actions: assign({ errorMsg: ({ event }) => event.errorMsg }),
      target: ".idle",
      reenter: true,
    },
  },
  states: {
    idle: {
      entry: "reset",
      on: {
        start: {
          guard: "hasTextAreaEl",
          actions: [
            assign({
              isLoading: true,
              errorMsg: null,
            }),
          ],
          target: "gettingAudioStream",
        },
      },
    },
    gettingAudioStream: {
      invoke: {
        src: "audioStreamActor",
        onDone: {
          actions: assign({
            audioStream: ({ event }) => event.output,
          }),
          target: "creatingRecognizer",
        },
        onError: {
          actions: raise(({ event }) => ({
            type: "error",
            errorMsg: (event.error as Error).message,
          })),
        },
      },
    },
    creatingRecognizer: {
      invoke: {
        src: "speechRecognizerActor",
        input: ({ context }) => context.audioStream!,
        onDone: {
          actions: assign({
            speechRecognizer: ({ event }) => event.output,
          }),
          target: "settingUpRecognizer",
        },
        onError: {
          actions: raise(({ event }) => ({
            type: "error",
            errorMsg: (event.error as Error).message,
          })),
        },
      },
    },
    settingUpRecognizer: {
      entry: ({ context, self }) => {
        const recognizer = context.speechRecognizer!

        // Set up event handlers for the recognizer
        recognizer.recognizing = (_s, e) => {
          self.send({
            type: "recognizing",
            text: e.result.text,
          })
        }

        recognizer.recognized = (_s, e) => {
          self.send({
            type: "recognized",
            text: e.result.text,
          })
        }

        recognizer.sessionStopped = (_s, _e) => {
          self.send({ type: "stop" })
        }

        recognizer.canceled = (_s, e) => {
          if (e.reason === CancellationReason.Error) {
            self.send({ type: "error", errorMsg: e.errorDetails })
          } else {
            self.send({ type: "stop" })
          }
        }
      },
      always: {
        target: "startingRecognition",
      },
    },
    startingRecognition: {
      entry: [
        ({ context }) => {
          context.speechRecognizer?.startContinuousRecognitionAsync()
        },
      ],
      always: {
        target: "listening",
      },
    },
    listening: {
      entry: assign({ isListening: true, isLoading: false }),
      after: {
        5000: {
          target: "idle",
        },
      },
      on: {
        recognizing: {
          actions: [
            "read",
            assign({
              recognizedText: ({ context, event }) => ({
                before: context.currentText.before,
                text: event.text,
                after: context.currentText.after,
              }),
            }),
            "write",
          ],
          target: "listening",
          reenter: true,
        },
        recognized: {
          actions: [
            "read",
            assign({
              recognizedText: ({ context, event }) => ({
                before: context.currentText.before + event.text,
                text: "",
                after: context.currentText.after,
              }),
            }),
            "write",
          ],
          target: "listening",
          reenter: true,
        },
        stop: {
          target: "idle",
        },
      },
    },
  },
})

export const speechRecognitionMachineAzure = speechRecognitionImpl.provide({
  actors: {
    speechRecognizerActor: speechRecognizerActorAzure,
  },
})

export default speechRecognitionMachineAzure
