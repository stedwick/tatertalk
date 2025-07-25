/** biome-ignore-all lint/style/noNonNullAssertion: machine will error if not available */
import { assertEvent, assign, setup, spawnChild } from "xstate"
import type { TextAreaContext } from "../lib/textarea"
import { readFromTextArea, writeToTextArea } from "../lib/textarea"
import type { AzureActor } from "./providers/azure"
import { azureSpeechMachine } from "./providers/azure"

interface SpeechContext {
  currentText: TextAreaContext
  recognizedText: TextAreaContext
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  recognizerMachine: typeof azureSpeechMachine
  recognizerActor: AzureActor | null
  errorMsg: string | null
}

const initialContext: SpeechContext = {
  currentText: { before: "", text: "", after: "" },
  recognizedText: { before: "", text: "", after: "" },
  textAreaRef: { current: null },
  recognizerMachine: azureSpeechMachine,
  recognizerActor: null,
  errorMsg: null,
} as const

const getInitialContext = () =>
  ({
    ...JSON.parse(JSON.stringify(initialContext)),
    recognizerMachine: azureSpeechMachine,
  }) as SpeechContext

type SpeechInput = {
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  recognizerMachine: typeof azureSpeechMachine
}

type SpeechEvents =
  | { type: "start" }
  | { type: "ready" }
  | { type: "recognizing"; text: string }
  | { type: "recognized"; text: string }
  | { type: "stop" }
  | { type: "error"; errorMsg: string }

export const speechRecognitionMachine = setup({
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
      recognizerMachine: ({ context }) => context.recognizerMachine,
      recognizerActor: ({ context }) => {
        context.recognizerActor?.send({ type: "stop" })
        return null
      },
      errorMsg: ({ context }) => context.errorMsg,
    }),
    spawnRecognizer: assign({
      recognizerActor: ({ context, self }) =>
        spawnChild(context.recognizerMachine, {
          input: { parentRef: self },
        }) as unknown as typeof context.recognizerActor,
    }),
    updateRecognizing: assign({
      recognizedText: ({ context, event }) => {
        assertEvent(event, "recognizing")
        return {
          before: context.currentText.before,
          text: event.text,
          after: context.currentText.after,
        }
      },
    }),
    updateRecognized: assign({
      recognizedText: ({ context, event }) => {
        assertEvent(event, "recognized")
        return {
          before: context.currentText.before + event.text,
          text: "",
          after: context.currentText.after,
        }
      },
    }),
    setError: assign({
      errorMsg: ({ event }) => {
        assertEvent(event, "error")
        return event.errorMsg
      },
    }),
    clearError: assign({
      errorMsg: () => null,
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
    recognizerMachine: input.recognizerMachine,
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
          actions: "clearError",
          target: "loading",
        },
      },
    },
    loading: {
      entry: "spawnRecognizer",
      on: {
        ready: {
          target: "listening",
        },
      },
    },
    listening: {
      after: {
        3000: {
          target: "idle",
        },
      },
      on: {
        recognizing: {
          actions: ["read", "updateRecognizing", "write"],
        },
        recognized: {
          actions: ["read", "updateRecognized", "write"],
        },
        stop: {
          target: "idle",
        },
      },
    },
  },
})

export default speechRecognitionMachine
