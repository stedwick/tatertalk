// Using AssemblyAI's streaming SDK
import { RealtimeTranscriber } from "assemblyai/streaming"
import RecordRTC from "recordrtc"
import type { ActorRefFrom, AnyActorRef } from "xstate"
import { assign, fromPromise, sendTo, setup } from "xstate"
import { getCustomWords, getSettings } from "../../lib/settings"
import { supabase } from "../../lib/supabase"
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
  const settings = getSettings()
  const apiKey = settings.assemblyAIKey
  if (!apiKey) {
    throw new Error(
      "AssemblyAI API key not configured. Please set it in Settings.",
    )
  }

  // Generate temporary token for browser compatibility
  let token: string
  if (import.meta.env.DEV) {
    // In development, use our proxy
    const response = await fetch("/api/assemblyai/v2/realtime/token", {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_in: 480, // 8 minutes
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to generate token: ${response.status} ${response.statusText}`,
      )
    }

    const tokenData = await response.json()
    token =
      typeof tokenData === "string" ? tokenData : tokenData.token || tokenData
  } else {
    // In production, request a token from our Supabase Edge Function using the authenticated client
    const { data, error } = await supabase.functions.invoke(
      "assemblyai-token",
      {
        body: { expires_in: 480, apiKey },
      },
    )
    if (error) {
      throw new Error(`Failed to generate token (edge): ${error.message}`)
    }
    token = typeof data === "string" ? data : data.token || data
  }

  const audioStream = await getAudioStream()

  const transcriber = new RealtimeTranscriber({
    token,
    sampleRate: 16_000,
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
    start: async ({ context }) => {
      const parentRef = context.parentRef
      const transcriber = context.transcriber!
      const stream = context.audioStream!

      // Wire transcript events
      type TranscriptEvent = { text?: string; message_type?: string }
      transcriber.on("transcript", (t: TranscriptEvent) => {
        const text = (t.text ?? "").trim()
        if (!text) return

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
        parentRef.send({ type: "ready" })
      } catch (error) {
        parentRef.send({ type: "error", errorMsg: String(error) })
        return
      }

      // Start recording and stream audio chunks to AssemblyAI
      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob: Blob) => {
          try {
            const buffer = await blob.arrayBuffer()
            await transcriber.sendAudio(buffer)
          } catch (err) {
            parentRef.send({
              type: "error",
              errorMsg: `Failed sending audio: ${String(err)}`,
            })
          }
        },
      })

      context.recorder = recorder
      recorder.startRecording()
    },
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
