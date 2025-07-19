import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../lib/supabase'
import FormInput from '../atoms/FormInput'
import { useAuthStore } from '../../lib/authStore'
import { signupSchema, type SignupFormData } from '../../lib/validationSchemas'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false)
  const { setError, setSuccess, clearError, clearSuccess } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    clearError()
    clearSuccess()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      
      if (error) {
        setError(error.message)
      } else {
        // Show success message for email verification
        setSuccess('Check your email for verification link')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card w-full max-w-sm sm:w-96 bg-base-100 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Sign Up</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
            register={register('email')}
            error={errors.email}
          />
          
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            register={register('password')}
            error={errors.password}
          />
          
          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
            register={register('confirmPassword')}
            error={errors.confirmPassword}
          />
          
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="divider my-3 sm:my-4">OR</div>
        
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="link link-primary"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm 