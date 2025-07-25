import { useActorRef, useSelector } from "@xstate/react"
import type { SnapshotFrom } from "xstate"
import type { azureSpeechMachine } from "../lang/providers/azure"
import speechRecognitionMachine from "../lang/speechLogic"

const loadingSelector = (
  state: SnapshotFrom<typeof speechRecognitionMachine>,
) => state.matches("loading")
const listeningSelector = (
  state: SnapshotFrom<typeof speechRecognitionMachine>,
) => state.matches("listening")
const errorMsgSelector = (
  state: SnapshotFrom<typeof speechRecognitionMachine>,
) => state.context.errorMsg

export const useSpeechRecognition = ({
  textAreaRef,
  recognizerMachine,
}: {
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  recognizerMachine: typeof azureSpeechMachine
}) => {
  const speechActor = useActorRef(speechRecognitionMachine, {
    input: { textAreaRef, recognizerMachine },
  })

  // Selectors for state values
  const isLoading = useSelector(speechActor, loadingSelector)
  const isListening = useSelector(speechActor, listeningSelector)
  const errorMsg = useSelector(speechActor, errorMsgSelector)

  const start = () => {
    speechActor.send({ type: "start" })
  }
  const stop = () => {
    speechActor.send({ type: "stop" })
  }

  return {
    isLoading,
    isListening,
    errorMsg,
    speechActor,
    start,
    stop,
  }
}
