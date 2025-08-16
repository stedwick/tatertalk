import type { Meta, StoryObj } from "@storybook/react"
import { GoogleLogin } from "../components/organisms/GoogleLogin"

const meta: Meta<typeof GoogleLogin> = {
  title: "Organisms/GoogleLogin",
  component: GoogleLogin,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
