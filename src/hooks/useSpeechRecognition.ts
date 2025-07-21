import { useActorRef, useSelector } from "@xstate/react"
import { speechRecognitionMachineAzure } from "../lang/speechLogic"

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

  return {
    isLoading,
    isListening,
    errorMsg,
    speechActor,
  }
}
