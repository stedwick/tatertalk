import type { Meta, StoryObj } from "@storybook/react"
import { useAtom } from "jotai"
import { themeAtom } from "../atoms/themeAtom"
import MountainBackground from "../components/atoms/MountainBackground"

// Component that demonstrates theme switching
const MountainBackgroundWithTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <div className="relative w-full h-screen">
      <MountainBackground />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="text-center text-white drop-shadow-lg mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {theme === "dark" ? "Mountain Night" : "Mountain Sunset"}
          </h1>
          <p className="text-xl">
            {theme === "dark"
              ? "Beautiful night sky with moon"
              : "Beautiful pastel colors"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  )
}

const meta: Meta<typeof MountainBackground> = {
  title: "Atoms/MountainBackground",
  component: MountainBackground,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithContent: Story = {
  args: {},
  render: (args) => (
    <div className="relative w-full h-screen">
      <MountainBackground {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white drop-shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Mountain Sunset</h1>
          <p className="text-xl">Beautiful pastel colors</p>
        </div>
      </div>
    </div>
  ),
}

export const WithThemeToggle: Story = {
  args: {},
  render: () => <MountainBackgroundWithTheme />,
}
