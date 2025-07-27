import {
  ArrowLeftIcon,
  CheckIcon,
  CloudIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  MicrophoneIcon,
  ServerIcon,
} from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { getSettings, saveSettings } from "../../lib/settings"
import {
  type SettingsFormData,
  settingsSchema,
} from "../../lib/validationSchemas"
import ActionButton from "../atoms/ActionButton"
import FormInput from "../atoms/FormInput"

const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: getSettings(),
  })

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    watch,
  } = methods

  const selectedProvider = watch("speechProvider")

  useEffect(() => {
    // Load settings on mount
    reset(getSettings())
  }, [reset])

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Save to localStorage
      saveSettings({
        speechProvider: data.speechProvider,
        azureSpeechKey: data.azureSpeechKey,
        azureSpeechRegion: data.azureSpeechRegion,
        autoPunctuation: data.autoPunctuation,
        customWords: data.customWords || "",
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        navigate("/")
      }
    } else {
      navigate("/")
    }
  }

  return (
    <div className="flex-1 px-4 py-6 flex flex-col relative">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="btn btn-ghost btn-circle"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Cog6ToothIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="alert alert-success mb-6">
            <CheckIcon className="w-5 h-5" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Speech Provider Selection */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <MicrophoneIcon className="w-5 h-5" />
                  Speech Provider
                </h2>
                <p className="text-base-content/70 mb-4">
                  Choose your preferred speech recognition provider
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="microsoft"
                      className="radio radio-primary"
                      {...register("speechProvider")}
                    />
                    <div className="flex items-center gap-2">
                      <ServerIcon className="w-5 h-5" />
                      <span>Microsoft Azure</span>
                      <span className="badge badge-primary">Default</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer opacity-50">
                    <input
                      type="radio"
                      value="google"
                      className="radio radio-primary"
                      disabled
                      {...register("speechProvider")}
                    />
                    <div className="flex items-center gap-2">
                      <CloudIcon className="w-5 h-5" />
                      <span>Google Speech-to-Text</span>
                      <span className="badge badge-ghost">Coming Soon</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer opacity-50">
                    <input
                      type="radio"
                      value="assemblyai"
                      className="radio radio-primary"
                      disabled
                      {...register("speechProvider")}
                    />
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span>AssemblyAI</span>
                      <span className="badge badge-ghost">Coming Soon</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Azure Credentials */}
            {selectedProvider === "microsoft" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title flex items-center gap-2">
                    <ServerIcon className="w-5 h-5" />
                    Azure Speech Service Credentials
                  </h2>
                  <p className="text-base-content/70 mb-4">
                    Configure your Azure Speech Service credentials
                  </p>

                  <div className="space-y-4">
                    <FormInput
                      name="azureSpeechKey"
                      label="Azure Speech Key"
                      type="password"
                      placeholder="Enter your Azure Speech Key"
                    />

                    <FormInput
                      name="azureSpeechRegion"
                      label="Azure Speech Region"
                      type="text"
                      placeholder="e.g., eastus, westus2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Punctuation Settings */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Punctuation</h2>
                <p className="text-base-content/70 mb-4">
                  Choose how punctuation should be handled
                </p>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="true"
                      className="radio radio-primary"
                      {...register("autoPunctuation")}
                    />
                    <span>Auto punctuation (recommended)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="false"
                      className="radio radio-primary"
                      {...register("autoPunctuation")}
                    />
                    <span>Manual punctuation</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Custom Words */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Custom Words</h2>
                <p className="text-base-content/70 mb-4">
                  Add custom words or phrases to improve recognition accuracy
                </p>

                <div className="form-control w-full">
                  <label htmlFor="customWords" className="label">
                    <span className="label-text">
                      Custom Words (comma-separated)
                    </span>
                  </label>
                  <textarea
                    id="customWords"
                    className="textarea textarea-bordered w-full"
                    placeholder="e.g., tatertalk, speech recognition, voice dictation"
                    rows={4}
                    {...register("customWords")}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <ActionButton
                onClick={handleBack}
                className="btn-outline"
                disabled={isSaving}
              >
                Back
              </ActionButton>

              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={isSaving || !isDirty}
              >
                {isSaving ? (
                  <div className="loading loading-spinner loading-sm" />
                ) : (
                  <CheckIcon className="w-5 h-5" />
                )}
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default SettingsPage
