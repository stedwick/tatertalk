import React from 'react'
import { UseFormRegisterReturn, FieldError } from 'react-hook-form'

interface FormInputProps {
  label: string
  type: 'text' | 'email' | 'password'
  placeholder?: string
  required?: boolean
  register: UseFormRegisterReturn
  error?: FieldError
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  required = false,
  register,
  error
}) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
        {...register}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error.message}</span>
        </label>
      )}
    </div>
  )
}

export default FormInput 