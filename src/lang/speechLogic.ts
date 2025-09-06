import { assertEvent, assign, enqueueActions, setup } from "xstate"
import { getSettings } from "../lib/settings"
import type { TextAreaContext } from "../lib/textarea"
import { readFromTextArea, writeToTextArea } from "../lib/textarea"
import type {
  AssemblyAIActor,
  AssemblyAISpeechMachine,
} from "./providers/assemblyai"
import { assemblyAISpeechMachine } from "./providers/assemblyai"
import type { AzureActor, AzureSpeechMachine } from "./providers/azure"
import { azureSpeechMachine } from "./providers/azure"
import type { WebSpeechActor, WebSpeechMachine } from "./providers/webSpeechApi"
import { webSpeechMachine } from "./providers/webSpeechApi"
import { minPunctuate, punctuateText } from "./punctuation"

interface SpeechContext {
  currentText: TextAreaContext
  recognizedText: TextAreaContext
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  recognizerMachine:
    | AzureSpeechMachine
    | WebSpeechMachine
    | AssemblyAISpeechMachine
  recognizerActor: AzureActor | WebSpeechActor | AssemblyAIActor | null
  errorMsg: string | null
}

const initialContext: SpeechContext = {
  currentText: { before: "", text: "", after: "" },
  recognizedText: { before: "", text: "", after: "" },
  textAreaRef: { current: null },
  recognizerMachine: webSpeechMachine,
  recognizerActor: null,
  errorMsg: null,
} as const

const getInitialContext = () =>
  ({
    ...JSON.parse(JSON.stringify(initialContext)),
    recognizerMachine: webSpeechMachine,
  }) as SpeechContext

type SpeechInput = {
  textAreaRef: React.RefObject<HTMLTextAreaElement>
}

type SpeechEvents =
  | { type: "start" }
  | { type: "ready" }
  | { type: "recognizing"; text: string }
  | { type: "recognized"; text: string }
  | { type: "stop" }
  | { type: "error"; errorMsg: string }

export const speechRecognitionMachineImpl = setup({
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
    getRecognizerMachine: assign({
      recognizerMachine: webSpeechMachine,
    }),
    spawnRecognizer: assign({
      recognizerActor: ({ context, self, spawn }) =>
        spawn(context.recognizerMachine, {
          input: { parentRef: self },
        }) as AzureActor | WebSpeechActor | AssemblyAIActor,
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
    minPunctuateFinal: assign({
      recognizedText: ({ context }) => ({
        before:
          context.recognizedText.before + minPunctuate(context.recognizedText),
        text: "",
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
    shouldPunctuate: () => false,
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
          actions: "clearError",
          target: "loading",
        },
      },
    },
    loading: {
      entry: ["getRecognizerMachine", "spawnRecognizer"],
      on: {
        ready: {
          target: "listening",
        },
      },
    },
    listening: {
      // NOTE: Can we make this timeout configurable?
      after: {
        10000: {
          target: "idle",
        },
      },
      on: {
        recognizing: {
          actions: ["read", "updateRecognize", "minPunctuate", "write"],
          target: "listening",
          reenter: true, // for the after delayed transition to idle
        },
        recognized: {
          actions: enqueueActions(({ enqueue, check }) => {
            enqueue("read")
            enqueue("updateRecognize")
            if (check({ type: "shouldPunctuate" })) {
              enqueue("punctuate")
            } else {
              enqueue("minPunctuateFinal")
            }
            enqueue("write")
          }),
          target: "listening",
          reenter: true, // for the after delayed transition to idle
        },
        // BUG: If the mic is on and you navigate away to settings, it gets stuck on.
        stop: {
          target: "idle",
        },
      },
    },
  },
})

export type SpeechRecognitionMachineImpl = typeof speechRecognitionMachineImpl

export const taterMachine = speechRecognitionMachineImpl.provide({
  actions: {
    getRecognizerMachine: assign({
      recognizerMachine: () => {
        const settings = getSettings()
        if (settings.speechProvider === "microsoft") {
          return azureSpeechMachine
        }
        if (settings.speechProvider === "assemblyai") {
          return assemblyAISpeechMachine
        }
        return webSpeechMachine
      },
    }),
  },
  guards: {
    shouldPunctuate: () => getSettings().autoPunctuation === "false",
  },
})

export type TaterMachine = typeof taterMachine
