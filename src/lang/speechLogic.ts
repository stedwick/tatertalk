/** biome-ignore-all lint/style/noNonNullAssertion: machine will error if not available */
import { assertEvent, assign, setup } from "xstate"
import type { TextAreaContext } from "../lib/textarea"
import { readFromTextArea, writeToTextArea } from "../lib/textarea"
import type { AzureActor } from "./providers/azure"
import { azureSpeechMachine } from "./providers/azure"
import { minPunctuate, punctuateText } from "./punctuation"

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
      recognizerActor: ({ context, self, spawn }) =>
        spawn(context.recognizerMachine, {
          input: { parentRef: self },
        }),
    }),
    updateRecognize: assign({
      recognizedText: ({ context, event }) => {
        assertEvent(event, ["recognizing", "recognized"])
        return {
          before: context.currentText.before,
          text: event.text,
          after: context.currentText.after,
        }
      },
    }),
    punctuate: assign({
      recognizedText: ({ context }) => ({
        before:
          context.recognizedText.before + punctuateText(context.recognizedText),
        text: "",
        after: context.recognizedText.after,
      }),
    }),
    minPunctuate: assign({
      recognizedText: ({ context }) => ({
        before: context.recognizedText.before,
        text: minPunctuate(context.recognizedText),
        after: context.recognizedText.after,
      }),
    }),
    setError: assign({
      errorMsg: ({ event }) => {
        assertEvent(event, "error")
        return event.errorMsg
      },
    }),
    clearError: assign({
      errorMsg: null,
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
          actions: ["read", "updateRecognize", "minPunctuate", "write"],
          target: "listening",
          reenter: true, // for the after 3000ms transition to idle
        },
        recognized: {
          actions: ["read", "updateRecognize", "punctuate", "write"],
          target: "listening",
          reenter: true, // for the after 3000ms transition to idle
        },
        stop: {
          target: "idle",
        },
      },
    },
  },
})

export default speechRecognitionMachine
