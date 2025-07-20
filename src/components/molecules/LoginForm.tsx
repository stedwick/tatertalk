import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSupabase } from "../../hooks/useSupabase"
import { type LoginFormData, loginSchema } from "../../lib/validationSchemas"
import FormInput from "../atoms/FormInput"

interface LoginFormProps {
  onSwitchToSignup: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [loading, setLoading] = useState(false)
  const { signIn } = useSupabase()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      await signIn(data.email, data.password)
    } catch (_error) {
      // Error is handled by the hook
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card w-full max-w-sm sm:w-96 bg-base-100 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
          Login
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

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </FormProvider>

        <div className="divider my-3 sm:my-4">OR</div>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="link link-primary"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
