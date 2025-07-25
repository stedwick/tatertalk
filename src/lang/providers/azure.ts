/** biome-ignore-all lint/style/noNonNullAssertion: machine will error if not available */
import {
  AudioConfig,
  CancellationReason,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk"
import type { ActorRefFrom, AnyActorRef } from "xstate"
import { assign, fromPromise, sendTo, setup } from "xstate"
import { getAzureCredentials } from "../../lib/azureConfig"

interface AzureContext {
  parentRef: AnyActorRef
  audioStream: MediaStream | null
  speechRecognizer: SpeechRecognizer | null
}

type AzureInput = {
  parentRef: AnyActorRef
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
    input: {} as AzureInput,
    context: {} as AzureContext,
    events: {} as AzureEvents,
  },
  actors: {
    setupAzure,
  },
  actions: {
    start: ({ context }) => {
      const recognizer = context.speechRecognizer!
      const parentRef = context.parentRef

      recognizer.recognizing = (_s, event) => {
        parentRef.send({
          type: "recognizing",
          text: event.result.text,
        })
      }
      recognizer.recognized = (_s, event) => {
        parentRef.send({
          type: "recognized",
          text: event.result.text,
        })
      }
      recognizer.sessionStopped = () => {
        parentRef.send({ type: "stop" })
      }
      recognizer.canceled = (_s, event) => {
        if (event.reason === CancellationReason.Error) {
          parentRef.send({
            type: "error",
            errorMsg: event.errorDetails,
          })
        } else {
          parentRef.send({ type: "stop" })
        }
      }

      recognizer.startContinuousRecognitionAsync(
        () => {
          parentRef.send({ type: "ready" })
        },
        (err) => {
          console.error("[azureSpeechMachine] Error starting recognizer", err)
          parentRef.send({ type: "error", errorMsg: err })
        },
      )
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
  context: ({ input }) => ({
    parentRef: input.parentRef,
    audioStream: null,
    speechRecognizer: null,
  }),
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
            // guard: "hasRecognizer",
            target: "listen",
          },
          onError: {
            actions: sendTo(
              ({ context }) => context.parentRef,
              ({ event }) => ({
                type: "error",
                errorMsg: (event.error as Error).message,
              }),
            ),

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
