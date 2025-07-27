/**
 * Azure Speech Service configuration utilities
 */

import {
  PhraseListGrammar,
  ServicePropertyChannel,
  SpeechConfig,
  type SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk"
import { getSettings } from "../../lib/settings"

export interface AzureCredentials {
  key: string
  region: string
}

/**
 * Get Azure Speech Service credentials from localStorage
 */
export const getAzureCredentials = (): AzureCredentials | null => {
  const settings = getSettings()

  if (!settings.azureSpeechKey || !settings.azureSpeechRegion) {
    return null
  }

  return {
    key: settings.azureSpeechKey,
    region: settings.azureSpeechRegion,
  }
}

/**
 * Configure Azure SpeechConfig with user settings
 */
export const configureSpeech = (): SpeechConfig => {
  const credentials = getAzureCredentials()
  if (!credentials) {
    throw new Error(
      "Azure Speech Service credentials not configured. Please set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in localStorage.",
    )
  }

  const speechConfig = SpeechConfig.fromSubscription(
    credentials.key,
    credentials.region,
  )

  const settings = getSettings()

  // Configure auto-punctuation based on settings
  if (settings.autoPunctuation === "false") {
    // Enable dictation mode for better transcription of natural speech
    speechConfig.enableDictation()
    speechConfig.setServiceProperty(
      "punctuation",
      "explicit",
      ServicePropertyChannel.UriQueryParameter,
    )
  }
  return speechConfig
}

/**
 * Add custom phrases to the speech recognizer
 */
export const addCustomPhrases = (speechRecognizer: SpeechRecognizer): void => {
  const settings = getSettings()

  // Add custom phrases if provided
  if (settings.customWords.trim()) {
    const phraseList = PhraseListGrammar.fromRecognizer(speechRecognizer)
    const customPhrases = settings.customWords
      .split(",")
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0)

    for (const phrase of customPhrases) {
      phraseList.addPhrase(phrase)
    }
  }
}
