import { SparklesIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import type React from "react"
import { useId } from "react"
import { Link } from "react-router"
import { useAIProofreading } from "../../hooks/useAIProofreading"

interface AIProofreadingToggleProps {
  className?: string
}

const AIProofreadingToggle: React.FC<AIProofreadingToggleProps> = ({
  className = "",
}) => {
  const { isEnabled, setIsEnabled, canEnable, isLoading } = useAIProofreading()
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
        {isLoading ? (
          <span className="loading loading-spinner loading-sm text-primary" />
        ) : (
          <input
            id={checkboxId}
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            disabled={!canEnable || isLoading}
          />
        )}
        <span
          className={clsx(
            "label-text flex items-center gap-2",
            !canEnable && "cursor-not-allowed",
          )}
        >
          <SparklesIcon className="w-4 h-4" />
          AI Proofreading
          {!canEnable && !isLoading && (
            <Link
              to="/settings"
              className="link text-base-content/50 cursor-pointer hover:text-primary"
            >
              (Go to Settings)
            </Link>
          )}
        </span>
      </label>
    </div>
  )
}

export default AIProofreadingToggle
