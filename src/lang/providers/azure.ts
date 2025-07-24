import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk"
import { fromPromise } from "xstate"
import { getAzureCredentials } from "../../lib/azureConfig"

export const speechRecognizerActorAzure = fromPromise(
  async ({ input }: { input: MediaStream }) => {
    const mediaStream = input
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
    const audioConfig = AudioConfig.fromStreamInput(mediaStream)
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
    return recognizer
  },
)
