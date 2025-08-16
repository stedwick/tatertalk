/**
 * AssemblyAI configuration utilities
 */

import { RealtimeTranscriber } from "assemblyai/streaming"
import RecordRTC from "recordrtc"
import { getSettings } from "../../lib/settings"
import { supabase } from "../../lib/supabase"

/**
 * Interface for cached token data
 */
interface CachedToken {
  token: string
  expiryTime: number // Unix timestamp in milliseconds
}

const ASSEMBLYAI_TOKEN_CACHE_KEY = "assemblyai_token_cache"

/**
 * Save token to localStorage with expiry time
 */
const saveTokenToCache = (token: string, expiresInSeconds: number): void => {
  const expiryTime = Date.now() + expiresInSeconds * 1000
  const cachedToken: CachedToken = {
    token,
    expiryTime,
  }
  localStorage.setItem(ASSEMBLYAI_TOKEN_CACHE_KEY, JSON.stringify(cachedToken))
}

/**
 * Retrieve cached token from localStorage if it's still valid
 * Returns null if no token exists or if it expires within 2 minutes
 */
const getCachedToken = (): string | null => {
  const cachedData = localStorage.getItem(ASSEMBLYAI_TOKEN_CACHE_KEY)
  if (!cachedData) {
    return null
  }

  const cachedToken: CachedToken = JSON.parse(cachedData)
  const now = Date.now()
  const twoMinutesFromNow = now + 2 * 60 * 1000 // 2 minutes in milliseconds

  // Check if token expires within 2 minutes
  if (cachedToken.expiryTime <= twoMinutesFromNow) {
    // Token is expired or will expire soon, remove it
    localStorage.removeItem(ASSEMBLYAI_TOKEN_CACHE_KEY)
    return null
  }

  return cachedToken.token
}

/**
 * Get AssemblyAI credentials from localStorage
 */
export const getAssemblyAIKey = () => {
  const settings = getSettings()
  return settings.assemblyAIKey
}

/**
 * Generate a temporary token for AssemblyAI streaming
 * Uses cached token if available and not expiring within 2 minutes
 */
export const generateToken = async (apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "AssemblyAI API key not configured. Please set it in Settings.",
    )
  }

  // Check for cached token first
  const cachedToken = getCachedToken()
  if (cachedToken) {
    return cachedToken
  }

  const expiresInSeconds = 480 // 8 minutes
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
        expires_in: expiresInSeconds,
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Failed to generate AssemblyAI token: ${response.status} ${response.statusText}`,
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
        body: { expires_in: expiresInSeconds, apiKey },
      },
    )
    if (error) {
      throw new Error(`Failed to generate AssemblyAI token: ${error.message}`)
    }

    token = typeof data === "string" ? data : data.token || data
  }

  // Cache the new token
  saveTokenToCache(token, expiresInSeconds)
  return token
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
    disableLogs: true,
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
