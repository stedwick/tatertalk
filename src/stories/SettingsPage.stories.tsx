import type { Meta, StoryObj } from "@storybook/react"
import { BrowserRouter } from "react-router"
import SettingsPage from "../components/pages/SettingsPage"

const meta: Meta<typeof SettingsPage> = {
  title: "Pages/SettingsPage",
  component: SettingsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen bg-base-100">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithExistingSettings: Story = {
  parameters: {
    docs: {
      description: {
        story: "Settings page with pre-populated values from localStorage",
      },
    },
  },
}

export const WithValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: "Settings page showing validation errors for required fields",
      },
    },
  },
}
