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

export const settingsSchema = z
  .object({
    speechProvider: z.enum(["microsoft", "browser", "assemblyai"]),
    azureSpeechKey: z.string(),
    azureSpeechRegion: z.string(),
    autoPunctuation: z.enum(["true", "false"]),
    customWords: z.string(),
    assemblyAIToken: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.speechProvider === "microsoft") {
        return data.azureSpeechKey.length > 0
      }
      return true
    },
    {
      message: "Azure Speech Key is required when using the Microsoft provider",
      path: ["azureSpeechKey"],
    },
  )
  .refine(
    (data) => {
      if (data.speechProvider === "microsoft") {
        return data.azureSpeechRegion.length > 0
      }
      return true
    },
    {
      message:
        "Azure Speech Region is required when using the Microsoft provider",
      path: ["azureSpeechRegion"],
    },
  )
  .refine(
    (data) => {
      if (data.speechProvider === "assemblyai") {
        return (data.assemblyAIToken ?? "").length > 0
      }
      return true
    },
    {
      message: "AssemblyAI token is required when using AssemblyAI provider",
      path: ["assemblyAIToken"],
    },
  )

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
