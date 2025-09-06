import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { MemoryRouter } from "react-router"
import AIProofreadingToggle from "../components/atoms/AIProofreadingToggle"

type AIProofreadingToggleProps = React.ComponentProps<
  typeof AIProofreadingToggle
>

// Story args type that omits setIsEnabled since it's handled by the wrapper
type StoryArgs = Omit<AIProofreadingToggleProps, "setIsEnabled">

const meta: Meta<StoryArgs> = {
  title: "Atoms/AIProofreadingToggle",
  component: AIProofreadingToggle as any,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    isEnabled: {
      control: "boolean",
      description: "Whether AI proofreading is currently enabled",
    },
    canEnable: {
      control: "boolean",
      description:
        "Whether AI proofreading can be enabled (settings configured)",
    },
    isLoading: {
      control: "boolean",
      description: "Whether AI proofreading is currently processing",
    },
  },
}

export default meta
type Story = StoryObj<StoryArgs>

// Wrapper component to handle state
const AIProofreadingToggleWrapper = (args: StoryArgs) => {
  const [isEnabled, setIsEnabled] = useState(args.isEnabled)

  return (
    <AIProofreadingToggle
      {...args}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
    />
  )
}

export const Default: Story = {
  render: (args) => <AIProofreadingToggleWrapper {...args} />,
  args: {
    isEnabled: false,
    canEnable: true,
    isLoading: false,
  },
}

export const Enabled: Story = {
  render: (args) => <AIProofreadingToggleWrapper {...args} />,
  args: {
    isEnabled: true,
    canEnable: true,
    isLoading: false,
  },
}

export const Disabled: Story = {
  render: (args) => <AIProofreadingToggleWrapper {...args} />,
  args: {
    isEnabled: false,
    canEnable: false,
    isLoading: false,
  },
}

export const Loading: Story = {
  render: (args) => <AIProofreadingToggleWrapper {...args} />,
  args: {
    isEnabled: true,
    canEnable: true,
    isLoading: true,
  },
}

export const WithCustomClass: Story = {
  render: (args) => <AIProofreadingToggleWrapper {...args} />,
  args: {
    isEnabled: false,
    canEnable: true,
    isLoading: false,
    className: "border border-primary p-4 rounded-lg",
  },
}
