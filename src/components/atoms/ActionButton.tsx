import clsx from "clsx"
import type React from "react"

interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  children: React.ReactNode
  icon?: React.ReactNode
  isAnimating?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  className,
  children,
  icon,
  isAnimating = false,
}) => {
  return (
    <button
      type="button"
      className={clsx("btn gap-2 relative", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <div className="relative">
          {isAnimating && (
            <div className="absolute inset-0 animate-ping">{icon}</div>
          )}
          {icon}
        </div>
      )}
      {children}
    </button>
  )
}

export default ActionButton
