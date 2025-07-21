import type { Meta, StoryObj } from "@storybook/react"
import SpeechRecognitionTest from "../components/organisms/SpeechRecognitionTest"

const meta: Meta<typeof SpeechRecognitionTest> = {
  title: "Organisms/SpeechRecognitionTest",
  component: SpeechRecognitionTest,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A comprehensive speech recognition component that uses Microsoft Azure Speech-to-Text service for real-time transcription.

## Features
- **Real-time speech-to-text transcription** using Azure Cognitive Services
- **Start/Stop recognition controls** with visual feedback and Heroicons
- **Error handling and display** with user-friendly error messages using Daisy UI alerts
- **Loading states** during initialization with spinner animation
- **State management** with XState for robust state handling
- **Responsive design** with Daisy UI components and Tailwind CSS
- **Accessibility** with proper ARIA labels and semantic HTML
- **Form integration** with React Hook Form patterns

## Technical Implementation
- Uses XState for state management with a comprehensive state machine
- Integrates with Azure Speech SDK for speech recognition
- Implements proper audio stream handling and cleanup
- Uses React Hook Form patterns for form management
- Built with TypeScript for type safety
- Uses Heroicons for consistent iconography
- Styled with Daisy UI and Tailwind CSS

## Requirements
- Azure Speech Service credentials must be configured in localStorage:
  - \`AZURE_SPEECH_KEY\`: Your Azure Speech Service key
  - \`AZURE_SPEECH_REGION\`: Your Azure region (e.g., "eastus")

## Usage
\`\`\`tsx
import SpeechRecognitionTest from '../components/organisms/SpeechRecognitionTest'

function MyApp() {
  return (
    <div>
      <SpeechRecognitionTest />
    </div>
  )
}
\`\`\`

## Hook Usage
For custom implementations, you can use the underlying hook:

\`\`\`tsx
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

function CustomSpeechComponent() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const { isLoading, isListening, errorMsg, speechActor } = useSpeechRecognition({
    textAreaRef,
  })

  return (
    <div>
      <textarea ref={textAreaRef} readOnly />
      <button onClick={() => speechActor.send({ type: "start" })}>
        Start Recognition
      </button>
      {errorMsg && <div>Error: {errorMsg}</div>}
    </div>
  )
}
\`\`\`

## State Machine
The component uses an XState machine with the following states:
- **idle**: Initial state, ready to start recognition
- **gettingAudioStream**: Acquiring microphone access
- **creatingRecognizer**: Setting up Azure Speech recognizer
- **settingUpRecognizer**: Configuring event handlers
- **startingRecognition**: Initiating continuous recognition
- **listening**: Actively recognizing speech

## Error Handling
The component handles various error scenarios:
- Missing Azure credentials
- Microphone access denied
- Network connectivity issues
- Invalid Azure credentials
- Audio stream failures

## UI Components
- **Header**: Clean title with responsive design
- **Error Alert**: Daisy UI alert component for error display
- **Textarea**: Large, bordered textarea for transcription display
- **Control Buttons**: Primary buttons with Heroicons for start/stop/loading states
- **Labels**: Descriptive labels with helper text
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Default state of the speech recognition component. Shows the interface ready for speech recognition with a clean, modern UI using Daisy UI components and Heroicons.",
      },
    },
  },
}
