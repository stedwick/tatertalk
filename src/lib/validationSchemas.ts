import { z } from "zod"

// Shared validation schemas
const emailSchema = z
  .email("Please enter a valid email address")
  .min(1, "Email is required")

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters")

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const settingsSchema = z.object({
  speechProvider: z.enum(["microsoft", "google", "assemblyai"]),
  azureSpeechKey: z.string().min(1, "Azure Speech Key is required"),
  azureSpeechRegion: z.string().min(1, "Azure Speech Region is required"),
  autoPunctuation: z.boolean(),
  customWords: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
