import { useActorRef, useSelector } from "@xstate/react"
import speechRecognitionMachineAzure from "../lang/speechLogic"

export const useSpeechRecognition = ({
  textAreaRef,
}: {
  textAreaRef: React.RefObject<HTMLTextAreaElement>
}) => {
  const speechActor = useActorRef(speechRecognitionMachineAzure, {
    input: { textAreaRef },
  })

  // Selectors for state values
  const isLoading = useSelector(speechActor, (state) => state.context.isLoading)
  const isListening = useSelector(
    speechActor,
    (state) => state.context.isListening,
  )
  const errorMsg = useSelector(speechActor, (state) => state.context.errorMsg)

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
