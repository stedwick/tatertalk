import type { Meta, StoryObj } from "@storybook/react"
import { BrowserRouter } from "react-router"
import Header from "../components/atoms/Header"

const meta: Meta<typeof Header> = {
  title: "Atoms/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithUser: Story = {
  parameters: {
    mockData: {
      user: {
        id: "test-user-id",
        email: "test@example.com",
      },
    },
  },
}
