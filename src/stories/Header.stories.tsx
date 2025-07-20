import type { Meta, StoryObj } from "@storybook/react"
import Header from "../components/atoms/Header"

const meta: Meta<typeof Header> = {
  title: "Atoms/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onMenuClick: { action: "menu clicked" },
    onThemeToggle: { action: "theme toggled" },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const WithMenu: Story = {
  args: {
    onMenuClick: () => console.log("Menu clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    isDarkMode: false,
    showMenu: true,
  },
}

export const WithoutMenu: Story = {
  args: {
    onThemeToggle: () => console.log("Theme toggled"),
    isDarkMode: false,
    showMenu: false,
  },
}

export const DarkMode: Story = {
  args: {
    onMenuClick: () => console.log("Menu clicked"),
    onThemeToggle: () => console.log("Theme toggled"),
    isDarkMode: true,
    showMenu: true,
  },
}
