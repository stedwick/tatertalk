/**
 * AssemblyAI configuration utilities
 */

import { RealtimeTranscriber } from "assemblyai/streaming"
import RecordRTC from "recordrtc"
import { getSettings } from "../../lib/settings"
import { supabase } from "../../lib/supabase"

/**
 * Get AssemblyAI credentials from localStorage
 */
export const getAssemblyAIKey = () => {
  const settings = getSettings()
  return settings.assemblyAIKey
}

/**
 * Generate a temporary token for AssemblyAI streaming
 */
export const generateToken = async (apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "AssemblyAI API key not configured. Please set it in Settings.",
    )
  }
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
        `Failed to generate AssemblyAI token: ${response.status} ${response.statusText}`,
      )
    }

    const tokenData = await response.json()
    return typeof tokenData === "string"
      ? tokenData
      : tokenData.token || tokenData
  } else {
    // In production, request a token from our Supabase Edge Function using the authenticated client
    const { data, error } = await supabase.functions.invoke(
      "assemblyai-token",
      {
        body: { expires_in: 480, apiKey },
      },
    )
    if (error) {
      throw new Error(`Failed to generate AssemblyAI token: ${error.message}`)
    }
    return typeof data === "string" ? data : data.token || data
  }
}

/**
 * Configure AssemblyAI RealtimeTranscriber with user settings
 */
export const configureTranscriber = async ({
  token,
  wordBoost,
  sampleRate = 16_000,
}: {
  token: string
  wordBoost: string[]
  sampleRate?: number
}): Promise<RealtimeTranscriber> => {
  const transcriber = new RealtimeTranscriber({
    token,
    sampleRate,
    wordBoost,
  })

  return transcriber
}

/**
 * Setup RecordRTC recorder for AssemblyAI audio streaming
 */
export const setupRecorder = (
  stream: MediaStream,
  audioHandler: (buffer: ArrayBuffer) => void,
  errHandler: (err: Error) => void,
): RecordRTC => {
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
        audioHandler(buffer)
      } catch (err) {
        errHandler(err as Error)
      }
    },
  })

  return recorder
}
