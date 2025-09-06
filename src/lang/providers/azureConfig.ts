/**
 * Azure Speech Service configuration utilities
 */

import {
  PhraseListGrammar,
  ServicePropertyChannel,
  SpeechConfig,
  type SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk"
import { getCustomWords, getSettings } from "../../lib/settings"

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
  // TODO: Can we force a final transcript within like three seconds?
  return speechConfig
}

/**
 * Add custom phrases to the speech recognizer
 */
export const addCustomPhrases = (speechRecognizer: SpeechRecognizer): void => {
  const customWords = getCustomWords()

  // Add custom phrases if provided
  if (customWords.length > 0) {
    const phraseList = PhraseListGrammar.fromRecognizer(speechRecognizer)

    for (const phrase of customWords) {
      phraseList.addPhrase(phrase)
    }
  }
}
