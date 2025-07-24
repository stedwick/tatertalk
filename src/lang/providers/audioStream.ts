import { fromPromise } from "xstate"

// Actor for handling audio stream setup
export const audioStreamActor = fromPromise(async () => {
  const constraints = {
    video: false,
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      sampleSize: 16,
      volume: 1,
    },
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    throw new Error(`Failed to get audio stream: ${error}`)
  }
})
