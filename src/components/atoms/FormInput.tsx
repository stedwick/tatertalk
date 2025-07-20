import clsx from "clsx"
import type React from "react"
import { useFormContext } from "react-hook-form"

interface FormInputProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  className?: string
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  className,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]

  return (
    <div className="form-control w-full">
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={clsx("input input-bordered w-full", className, {
          "input-error": error,
        })}
        {...register(name)}
      />
      {error && (
        <label htmlFor={name} className="label">
          <span className="label-text-alt text-error">
            {error.message?.toString()}
          </span>
        </label>
      )}
    </div>
  )
}

export default FormInput
