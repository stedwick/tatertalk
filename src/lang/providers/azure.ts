/** biome-ignore-all lint/style/noNonNullAssertion: machine will error if not available */
import {
  AudioConfig,
  CancellationReason,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk"
import type { ActorRefFrom } from "xstate"
import { assign, fromPromise, sendParent, setup } from "xstate"
import { getAzureCredentials } from "../../lib/azureConfig"

interface AzureContext {
  audioStream: MediaStream | null
  speechRecognizer: SpeechRecognizer | null
}

type AzureEvents = { type: "stop" }

const setupAzure = fromPromise(async () => {
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

  const constraints = {
    video: false,
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      sampleSize: 16,
      volume: 1,
    },
  }
  const audioStream = await navigator.mediaDevices.getUserMedia(constraints)

  const audioConfig = AudioConfig.fromStreamInput(audioStream)
  const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig)

  return { audioStream, speechRecognizer }
})

export const azureSpeechMachine = setup({
  types: {
    context: {} as AzureContext,
    events: {} as AzureEvents,
  },
  actors: {
    setupAzure,
  },
  actions: {
    start: ({ context }) => {
      const recognizer = context.speechRecognizer!

      recognizer.recognizing = (_s, event) => {
        sendParent({ type: "recognizing", text: event.result.text })
      }
      recognizer.recognized = (_s, event) => {
        sendParent({ type: "recognized", text: event.result.text })
      }
      recognizer.sessionStopped = () => {
        sendParent({ type: "stop" })
      }
      recognizer.canceled = (_s, event) => {
        if (event.reason === CancellationReason.Error) {
          sendParent({ type: "error", errorMsg: event.errorDetails })
        } else {
          sendParent({ type: "stop" })
        }
      }

      recognizer.startContinuousRecognitionAsync()
    },
    cleanup: ({ context }) => {
      if (context.speechRecognizer) {
        context.speechRecognizer.close()
      }
      if (context.audioStream) {
        context.audioStream.getTracks().forEach((track) => track.stop())
      }
    },
  },
  guards: {
    hasRecognizer: ({ context }) => context.speechRecognizer !== null,
  },
}).createMachine({
  id: "azureSpeech",
  context: {
    audioStream: null,
    speechRecognizer: null,
  },
  initial: "setup",
  on: {
    stop: {
      target: ".done",
    },
  },
  states: {
    setup: {
      invoke: [
        {
          src: "setupAzure",
          onDone: {
            actions: assign(({ event }) => event.output),
            guard: "hasRecognizer",
            target: "listen",
          },
          onError: {
            actions: [
              sendParent(({ event }) => ({
                type: "error",
                errorMsg: (event.error as Error).message,
              })),
            ],
            target: "done",
          },
        },
      ],
    },
    listen: {
      entry: "start",
      on: {
        stop: {
          target: "done",
        },
      },
    },
    done: {
      entry: "cleanup",
      type: "final",
    },
  },
})

export type AzureActor = ActorRefFrom<typeof azureSpeechMachine>
