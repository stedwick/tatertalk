import type React from "react"

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = "Click 🎙️ Start Dictation button below...",
  disabled = false,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col">
      <textarea
        className="textarea textarea-lg textarea-primary textarea-bordered w-full flex-1 text-lg leading-relaxed resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default TextArea
