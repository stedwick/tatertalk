import type { Meta, StoryObj } from "@storybook/react"
import MainPage from "../components/pages/MainPage"

const meta: Meta<typeof MainPage> = {
  title: "Pages/MainPage",
  component: MainPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="bg-base-100">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
