import type { Meta, StoryObj } from "@storybook/react"
import { useTheme } from "../hooks/useTheme"

// Component that demonstrates the useTheme hook
const ThemeDemo = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Theme Hook Demo</h2>
      <div className="space-y-4">
        <div>
          <p className="mb-2">
            Current theme:{" "}
            <strong>{theme === "dark" ? "Dark" : "Light"}</strong>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={toggleTheme}
          >
            Toggle Theme
          </button>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Theme State</h3>
            <p>theme: {theme}</p>
            <p>
              data-theme attribute:{" "}
              {document.documentElement.getAttribute("data-theme")}
            </p>
            <p>localStorage theme: {localStorage.getItem("theme")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta: Meta<typeof ThemeDemo> = {
  title: "Hooks/useTheme",
  component: ThemeDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
