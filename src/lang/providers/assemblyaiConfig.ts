/**
 * AssemblyAI configuration utilities
 */

import { RealtimeTranscriber } from "assemblyai/streaming"
import { getCustomWords, getSettings } from "../../lib/settings"
import { supabase } from "../../lib/supabase"

export interface AssemblyAICredentials {
  apiKey: string
}

/**
 * Get AssemblyAI credentials from localStorage
 */
export const getAssemblyAICredentials = (): AssemblyAICredentials | null => {
  const settings = getSettings()

  if (!settings.assemblyAIKey) {
    return null
  }

  return {
    apiKey: settings.assemblyAIKey,
  }
}

/**
 * Generate a temporary token for AssemblyAI streaming
 */
export const generateToken = async (apiKey: string): Promise<string> => {
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
      throw new Error(`Failed to generate token (edge): ${error.message}`)
    }
    return typeof data === "string" ? data : data.token || data
  }
}

/**
 * Configure AssemblyAI RealtimeTranscriber with user settings
 */
export const configureTranscriber = async (): Promise<RealtimeTranscriber> => {
  const credentials = getAssemblyAICredentials()
  if (!credentials) {
    throw new Error(
      "AssemblyAI API key not configured. Please set it in Settings.",
    )
  }

  const token = await generateToken(credentials.apiKey)

  const transcriber = new RealtimeTranscriber({
    token,
    sampleRate: 16_000,
    wordBoost: getCustomWords(),
  })

  return transcriber
}
