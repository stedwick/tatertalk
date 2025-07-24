/** biome-ignore-all lint/style/noNonNullAssertion: machine will error if not available */
import { assign, setup, spawnChild, stopChild } from "xstate"
import type { TextAreaContext } from "../lib/textarea"
import { readFromTextArea, writeToTextArea } from "../lib/textarea"
import type { AzureActor } from "./providers/azure"
import { azureSpeechMachine } from "./providers/azure"

interface SpeechContext {
  isLoading: boolean
  isListening: boolean
  currentText: TextAreaContext
  recognizedText: TextAreaContext
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  azureRef: AzureActor | null // child actor ref
  errorMsg: string | null
}

const initialContext: SpeechContext = {
  isLoading: false,
  isListening: false,
  currentText: { before: "", text: "", after: "" },
  recognizedText: { before: "", text: "", after: "" },
  textAreaRef: { current: null },
  azureRef: null,
  errorMsg: null,
} as const

const getInitialContext = () =>
  JSON.parse(JSON.stringify(initialContext)) as SpeechContext

type SpeechInput = { textAreaRef: React.RefObject<HTMLTextAreaElement> }

type SpeechEvents =
  | { type: "start" }
  | { type: "stop" }
  | { type: "ready" }
  | { type: "recognizing"; text: string }
  | { type: "recognized"; text: string }
  | { type: "error"; errorMsg: string }

export const speechRecognitionImpl = setup({
  types: {
    input: {} as SpeechInput,
    context: {} as SpeechContext,
    events: {} as SpeechEvents,
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
      textAreaRef: ({ context }) => context.textAreaRef,
      errorMsg: ({ context }) => context.errorMsg,
      azureRef: ({ context }) => {
        if (context.azureRef) stopChild(context.azureRef)
        return null
      },
    }),
    spawnAzure: assign({
      azureRef: () =>
        spawnChild(azureSpeechMachine, { input: {} }) as unknown as AzureActor,
      isLoading: true,
      errorMsg: null,
    }),
    stopAzure: assign({
      azureRef: ({ context }) => {
        if (context.azureRef) stopChild(context.azureRef)
        return null
      },
    }),
    setReady: assign({ isLoading: false }),
    setListening: assign({ isListening: true }),
    setIdle: assign({ isListening: false, isLoading: false }),
    setError: assign({
      errorMsg: ({ event }) => (event.type === "error" ? event.errorMsg : null),
    }),
    updateRecognizing: assign({
      recognizedText: ({ context, event }) =>
        event.type === "recognizing"
          ? {
              before: context.currentText.before,
              text: event.text,
              after: context.currentText.after,
            }
          : context.recognizedText,
    }),
    updateRecognized: assign({
      recognizedText: ({ context, event }) =>
        event.type === "recognized"
          ? {
              before: context.currentText.before + event.text,
              text: "",
              after: context.currentText.after,
            }
          : context.recognizedText,
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
      actions: "setError",
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
          actions: "spawnAzure",
          target: "loading",
        },
      },
    },
    loading: {
      on: {
        ready: {
          actions: "setReady",
          target: "listening",
        },
        error: {
          actions: "setError",
          target: "idle",
        },
      },
    },
    listening: {
      entry: "setListening",
      after: {
        5000: {
          actions: ["stopAzure", "setIdle"],
          target: "idle",
        },
      },
      on: {
        recognizing: {
          actions: ["read", "updateRecognizing", "write"],
          reenter: true,
        },
        recognized: {
          actions: ["read", "updateRecognized", "write"],
          reenter: true,
        },
        stop: {
          actions: ["stopAzure", "setIdle"],
          target: "idle",
        },
        error: {
          actions: ["setError", "stopAzure", "setIdle"],
          target: "idle",
        },
      },
    },
  },
})

export default speechRecognitionImpl
