import { SparklesIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import type React from "react"
import { useId } from "react"
import { Link } from "react-router"

interface AIProofreadingToggleProps {
  className?: string
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  canEnable: boolean
  isLoading: boolean
}

const AIProofreadingToggle: React.FC<AIProofreadingToggleProps> = ({
  className = "",
  isEnabled,
  setIsEnabled,
  canEnable,
  isLoading,
}) => {
  const checkboxId = useId()

  return (
    <div className={clsx("form-control", className)}>
      <label
        htmlFor={checkboxId}
        className={clsx(
          "label justify-start gap-3",
          canEnable ? "cursor-pointer" : "!cursor-not-allowed",
        )}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isLoading ? (
            <span className="loading loading-spinner text-primary w-6 h-6" />
          ) : (
            <input
              id={checkboxId}
              type="checkbox"
              className="checkbox checkbox-primary w-6 h-6"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              disabled={!canEnable || isLoading}
            />
          )}
        </div>
        <span
          className={clsx(
            "label-text flex items-center gap-2",
            !canEnable && "cursor-not-allowed",
          )}
        >
          <SparklesIcon className="w-4 h-4" />
          {canEnable || isLoading ? (
            <>
              <span className="hidden xxs:inline">AI Proofreading</span>
              <span className="xxs:hidden">AI</span>
            </>
          ) : (
            <>
              <span className="hidden xs:inline">
                AI Proofreading
                <Link
                  to="/settings"
                  className="link text-base-content/50 cursor-pointer hover:text-primary ml-2"
                >
                  (Go to Settings)
                </Link>
              </span>
              <span className="hidden xxs:inline xs:hidden">
                <Link
                  to="/settings"
                  className="link text-base-content/50 cursor-pointer hover:text-primary ml-2"
                >
                  AI Proofreading
                </Link>
              </span>
              <Link
                to="/settings"
                className="xxs:hidden link text-base-content/50 cursor-pointer hover:text-primary"
              >
                AI
              </Link>
            </>
          )}
        </span>
      </label>
    </div>
  )
}

export default AIProofreadingToggle
