import type { Meta, StoryObj } from "@storybook/react"
import { Provider } from "jotai"
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
      <Provider>
        <div className="bg-base-100 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
