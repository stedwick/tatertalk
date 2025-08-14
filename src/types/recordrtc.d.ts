declare module "recordrtc" {
	type RecorderOptions = any
	const RecordRTC: {
		new (s: MediaStream, o: RecorderOptions): {
			startRecording: () => void
			stopRecording: () => void
		}
		StereoAudioRecorder: unknown
	}
	export = RecordRTC
}