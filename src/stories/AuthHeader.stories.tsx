import type { Meta, StoryObj } from "@storybook/react"
import AuthHeader from "../components/atoms/AuthHeader"

const meta: Meta<typeof AuthHeader> = {
  title: "Atoms/AuthHeader",
  component: AuthHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onThemeToggle: { action: "theme toggled" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const LightMode: Story = {
  args: {
    onThemeToggle: () => console.log("Theme toggled"),
    isDarkMode: false,
  },
}

export const DarkMode: Story = {
  args: {
    onThemeToggle: () => console.log("Theme toggled"),
    isDarkMode: true,
  },
}
