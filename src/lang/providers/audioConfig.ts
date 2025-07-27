export const getAudioStream = async () => {
  const constraints = {
    video: false,
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      sampleSize: 16,
      volume: 1,
    },
  }
  const audioStream = await navigator.mediaDevices.getUserMedia(constraints)
  return audioStream
}
