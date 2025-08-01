import type { ActorRefFrom, AnyActorRef } from "xstate"
import { assign, fromPromise, sendTo, setup } from "xstate"
import { addCustomPhrases } from "./webSpeechConfig"

interface WebSpeechContext {
  parentRef: AnyActorRef
  recognition: SpeechRecognition | null
}

type WebSpeechInput = {
  parentRef: AnyActorRef
}

type WebSpeechEvents = { type: "stop" }

const setupWebSpeech = fromPromise(async () => {
  const SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition

  if (!SpeechRecognition) {
    throw new Error("Speech Recognition not supported in this browser")
  }

  const recognition = new SpeechRecognition()

  // Configure recognition settings
  recognition.continuous = true
  // recognition.lang = "en-US"
  recognition.interimResults = true
  // recognition.maxAlternatives = 1

  // Add custom phrases
  addCustomPhrases(recognition)

  return { recognition }
})

export const webSpeechMachine = setup({
  types: {
    input: {} as WebSpeechInput,
    context: {} as WebSpeechContext,
    events: {} as WebSpeechEvents,
  },
  actors: {
    setupWebSpeech,
  },
  actions: {
    start: ({ context }) => {
      const recognition = context.recognition!
      const parentRef = context.parentRef

      recognition.onresult = (event) => {
        // Handle speech recognition results
        // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList
        // Send the most recent final or confident result
        const { results, resultIndex } = event

        const len = results.length - 1
        for (let i = len; i >= resultIndex; i--) {
          const result = results[i]
          const heardAlt = result[0]
          const text = heardAlt.transcript.trim()
          if (!text) continue

          if (result.isFinal) {
            parentRef.send({
              type: "recognized",
              text,
            })
            break
          } else if (heardAlt.confidence > 0.01) {
            // Send interim results for real-time feedback
            parentRef.send({
              type: "recognizing",
              text,
            })
            break
          }
        }
      }

      recognition.onend = () => {
        parentRef.send({ type: "stop" })
      }

      recognition.onerror = (event) => {
        if (event.error === "no-speech") {
          // Ignore no-speech errors as they're common
          return
        }
        parentRef.send({
          type: "error",
          errorMsg: `Speech recognition error: ${event.error}`,
        })
      }

      recognition.onstart = () => {
        parentRef.send({ type: "ready" })
      }

      recognition.start()
    },
    cleanup: ({ context }) => {
      if (context.recognition) {
        try {
          context.recognition.stop()
        } catch (_error) {
          // Ignore errors when stopping recognition
        }
      }
    },
  },
}).createMachine({
  id: "webSpeech",
  context: ({ input }) => ({
    parentRef: input.parentRef,
    recognition: null,
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
          src: "setupWebSpeech",
          onDone: {
            actions: assign(({ event }) => event.output),
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

export type WebSpeechMachine = typeof webSpeechMachine
export type WebSpeechActor = ActorRefFrom<WebSpeechMachine>
