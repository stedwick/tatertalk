import type { Meta, StoryObj } from "@storybook/react"
import { MemoryRouter } from "react-router"
import AuthPage from "../components/pages/AuthPage"

const meta: Meta<typeof AuthPage> = {
  title: "Pages/AuthPage",
  component: AuthPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
