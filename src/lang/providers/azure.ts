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
  recognizer: SpeechRecognizer | null
  errorMsg: string | null
}

type AzureEvents =
  | { type: "start" }
  | { type: "stop" }
  | { type: "ready" }
  | { type: "recognizing"; text: string }
  | { type: "recognized"; text: string }
  | { type: "error"; errorMsg: string }

export const azureSpeechMachine = setup({
  types: {
    context: {} as AzureContext,
    events: {} as AzureEvents,
  },
  actions: {
    cleanup: ({ context }: { context: AzureContext }) => {
      if (context.recognizer) {
        context.recognizer.close()
      }
      if (context.audioStream) {
        context.audioStream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop())
      }
    },
  },
  actors: {
    setupAzure: fromPromise(async () => {
      const constraints = {
        video: false,
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          volume: 1,
        },
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
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
      const audioConfig = AudioConfig.fromStreamInput(stream)
      const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
      return { stream, recognizer }
    }),
  },
}).createMachine({
  id: "azureSpeech",
  initial: "loading",
  context: {
    audioStream: null,
    recognizer: null,
    errorMsg: null,
  },
  states: {
    loading: {
      invoke: [
        {
          src: "setupAzure",
          onDone: {
            actions: assign({
              audioStream: (_ctx, event) =>
                (event as any)?.data?.stream ?? null,
              recognizer: (_ctx, event) =>
                (event as any)?.data?.recognizer ?? null,
              errorMsg: (_) => null,
            }),
            target: "ready",
          },
          onError: {
            actions: [
              assign({
                errorMsg: (_ctx, event) =>
                  (event as any)?.data?.message ?? "Unknown error",
              }),
              sendParent((_ctx, event) => ({
                type: "error",
                errorMsg: (event as any)?.data?.message ?? "Unknown error",
              })),
              "cleanup",
            ],
            target: "error",
          },
        },
      ],
    },
    ready: {
      entry: sendParent(() => ({ type: "ready" })),
      on: {
        start: {
          target: "recognizing",
        },
        stop: {
          actions: "cleanup",
        },
      },
    },
    recognizing: {
      entry: [
        ({ context }) => {
          context.recognizer?.startContinuousRecognitionAsync()
        },
        ({ context, self }) => {
          const recognizer = context.recognizer!
          recognizer.recognizing = (
            _s: unknown,
            e: { result: { text: string } },
          ) => {
            self.send({ type: "recognizing", text: e.result.text })
          }
          recognizer.recognized = (
            _s: unknown,
            e: { result: { text: string } },
          ) => {
            self.send({ type: "recognized", text: e.result.text })
          }
          recognizer.sessionStopped = () => {
            self.send({ type: "stop" })
          }
          recognizer.canceled = (
            _s: unknown,
            e: { reason: any; errorDetails: string },
          ) => {
            if (e.reason === CancellationReason.Error) {
              self.send({ type: "error", errorMsg: e.errorDetails })
            } else {
              self.send({ type: "stop" })
            }
          }
        },
      ],
      on: {
        recognizing: {
          actions: sendParent((_, event: any) => ({
            type: "recognizing",
            text: event.text,
          })),
          reenter: true,
        },
        recognized: {
          actions: sendParent((_, event: any) => ({
            type: "recognized",
            text: event.text,
          })),
          reenter: true,
        },
        stop: {
          actions: "cleanup",
          target: "ready",
        },
        error: {
          actions: [
            assign({
              errorMsg: (_ctx, event: any) =>
                event?.errorMsg ?? "Unknown error",
            }),
            sendParent((_, event: any) => ({
              type: "error",
              errorMsg: event?.errorMsg ?? "Unknown error",
            })),
            "cleanup",
          ],
          target: "error",
        },
      },
    },
    error: {
      on: {
        start: "loading",
      },
      entry: "cleanup",
    },
  },
})

export type AzureActor = ActorRefFrom<typeof azureSpeechMachine>
