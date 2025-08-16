// Using AssemblyAI's streaming SDK
import type {
  RealtimeTranscriber,
  RealtimeTranscript,
} from "assemblyai/streaming"
import type RecordRTC from "recordrtc"
import type { ActorRefFrom, AnyActorRef } from "xstate"
import { assign, enqueueActions, fromPromise, sendTo, setup } from "xstate"
import { getCustomWords } from "../../lib/settings"
import {
  configureTranscriber,
  generateToken,
  getAssemblyAIKey,
  setupRecorder,
} from "./assemblyaiConfig"
import { getAudioStream } from "./audioConfig"

interface AssemblyAIContext {
  parentRef: AnyActorRef
  audioStream: MediaStream | null
  recorder: RecordRTC | null
  transcriber: RealtimeTranscriber | null
}

type AssemblyAIInput = {
  parentRef: AnyActorRef
}

type AssemblyAIEvents = { type: "stop" }

const setupAssemblyAI = fromPromise(async () => {
  const audioStream = await getAudioStream()
  const apiKey = getAssemblyAIKey()
  const token = await generateToken(apiKey)
  const transcriber = await configureTranscriber({
    token,
    wordBoost: getCustomWords(),
  })

  return { audioStream, transcriber }
})

export const assemblyAISpeechMachine = setup({
  types: {
    input: {} as AssemblyAIInput,
    context: {} as AssemblyAIContext,
    events: {} as AssemblyAIEvents,
  },
  actors: {
    setupAssemblyAI,
  },
  actions: {
    start: enqueueActions(async ({ context, enqueue }) => {
      const parentRef = context.parentRef
      const transcriber = context.transcriber!
      const stream = context.audioStream!

      // Wire transcript events
      transcriber.on("transcript", (t: RealtimeTranscript) => {
        const text = t.text
        const isFinal = t.message_type === "FinalTranscript"
        if (isFinal) {
          parentRef.send({ type: "recognized", text })
        } else {
          parentRef.send({ type: "recognizing", text })
        }
      })

      transcriber.on("error", (err: unknown) => {
        parentRef.send({
          type: "error",
          errorMsg: `AssemblyAI error: ${String((err as Error)?.message ?? err)}`,
        })
      })

      transcriber.on("close", () => {
        parentRef.send({ type: "stop" })
      })

      try {
        await transcriber.connect()
      } catch (error) {
        parentRef.send({ type: "error", errorMsg: String(error) })
        return
      }

      const audioHandler = (buffer: ArrayBuffer) => {
        transcriber.sendAudio(buffer)
      }
      const errHandler = (err: Error) => {
        parentRef.send({
          type: "error",
          errorMsg: `AssemblyAI error: ${err.message}`,
        })
      }
      // Start recording and stream audio chunks to AssemblyAI
      const recorder = setupRecorder(stream, audioHandler, errHandler)
      enqueue.assign({ recorder })
      recorder.startRecording()

      parentRef.send({ type: "ready" })
    }),
    cleanup: async ({ context }) => {
      try {
        if (context.recorder) {
          context.recorder.stopRecording()
        }
      } catch (_e) {}

      try {
        if (context.audioStream) {
          context.audioStream.getTracks().forEach((t) => t.stop())
        }
      } catch (_e) {}

      try {
        if (context.transcriber) {
          await context.transcriber.close()
        }
      } catch (_e) {}
    },
  },
}).createMachine({
  id: "assemblyAISpeech",
  context: ({ input }) => ({
    parentRef: input.parentRef,
    audioStream: null,
    recorder: null,
    transcriber: null,
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
          src: "setupAssemblyAI",
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

export type AssemblyAISpeechMachine = typeof assemblyAISpeechMachine
export type AssemblyAIActor = ActorRefFrom<AssemblyAISpeechMachine>
