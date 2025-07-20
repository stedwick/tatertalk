import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useAuthStore } from "../../lib/authStore"
import { supabase } from "../../lib/supabase"
import { type SignupFormData, signupSchema } from "../../lib/validationSchemas"
import FormInput from "../atoms/FormInput"

interface SignupFormProps {
  onSwitchToLogin: () => void
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false)
  const { setError, setSuccess, clearMessages } = useAuthStore()

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    clearMessages()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Check your email for verification link")
      }
    } catch (_error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card w-full max-w-sm sm:w-96 bg-base-100 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
          Sign Up
        </h2>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </FormProvider>

        <div className="divider my-3 sm:my-4">OR</div>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
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
