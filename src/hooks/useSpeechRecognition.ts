import { useActorRef, useSelector } from "@xstate/react"
import type { ActorRefFrom, SnapshotFrom } from "xstate"
import type { SpeechRecognitionMachineImpl } from "../lang/speechLogic"

type Snapshot = SnapshotFrom<SpeechRecognitionMachineImpl>
const loadingSelector = (state: Snapshot) => state.matches("loading")
const listeningSelector = (state: Snapshot) => state.matches("listening")
const errorMsgSelector = (state: Snapshot) => state.context.errorMsg

export const useSpeechRecognition = ({
  textAreaRef,
  speechRecognitionMachine,
}: {
  textAreaRef: React.RefObject<HTMLTextAreaElement>
  speechRecognitionMachine: SpeechRecognitionMachineImpl
}) => {
  // BUG: Fix speechRecognitionMachine type
  // biome-ignore lint/suspicious/noExplicitAny: Weird "Excessive stack depth comparing types"
  const speechActorUnknown = useActorRef(speechRecognitionMachine as any, {
    input: { textAreaRef },
  })
  const speechActor =
    speechActorUnknown as ActorRefFrom<SpeechRecognitionMachineImpl>

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
