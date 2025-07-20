import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSupabase } from "../../hooks/useSupabase"
import { type LoginFormData, loginSchema } from "../../lib/validationSchemas"
import FormInput from "../atoms/FormInput"

interface LoginFormProps {
  onSwitchToSignup: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { signIn, signInLoading, error, success } = useSupabase()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password)
    } catch (_error) {
      // Error is handled by the hook
    }
  }

  return (
    <div className="card w-full max-w-sm sm:w-96 bg-base-100 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
          Login
        </h2>

        {error && (
          <div className="alert alert-error mb-3 sm:mb-4">
            <ExclamationTriangleIcon className="stroke-current shrink-0 h-4 w-4 sm:h-6 sm:w-6" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-3 sm:mb-4">
            <CheckCircleIcon className="stroke-current shrink-0 h-4 w-4 sm:h-6 sm:w-6" />
            <span>{success}</span>
          </div>
        )}

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
              disabled={signInLoading}
            >
              {signInLoading ? (
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
