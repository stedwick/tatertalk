import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ 
  value, 
  onChange, 
  placeholder = "Click 🎙️ Start Dictation button below...",
  disabled = false 
}) => {
  return (
    <div className="w-full">
      <textarea
        className="textarea textarea-bordered w-full h-64 text-lg leading-relaxed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default TextArea; 