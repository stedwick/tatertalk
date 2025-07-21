import { forwardRef } from "react"

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      placeholder = "Click 🎙️ Start Dictation button below...",
      disabled = false,
    },
    ref,
  ) => {
    return (
      <div className="w-full flex-1 flex flex-col">
        <textarea
          ref={ref}
          className="textarea textarea-lg textarea-primary textarea-bordered w-full flex-1 text-lg leading-relaxed resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    )
  },
)

TextArea.displayName = "TextArea"

export default TextArea
