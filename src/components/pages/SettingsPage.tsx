import {
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  Cog6ToothIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { useId } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { getSettings, saveSettings } from "../../lib/settings"
import { themedToastError, themedToastSuccess } from "../../lib/themedToast"
import {
  type SettingsFormData,
  settingsSchema,
} from "../../lib/validationSchemas"
import { BackToHome } from "../atoms/BackToHome"
import FormInput from "../atoms/FormInput"

const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const customWordsId = useId()
  const methods = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: getSettings(),
  })

  const { register, handleSubmit, watch } = methods

  const selectedProvider = watch("speechProvider")

  const onSubmit = async (data: SettingsFormData) => {
    try {
      // Save to localStorage
      saveSettings(data)
      themedToastSuccess("Settings saved successfully")
      navigate("/")
    } catch (error) {
      themedToastError(`Error saving settings: ${error}`)
    }
  }

  return (
    <>
      <BackToHome className="mb-4" />
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <Cog6ToothIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </div>

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
                Choose your preferred speech recognition provider.
              </p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="browser"
                  className="radio radio-primary"
                  {...register("speechProvider")}
                />
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/icons8-chrome.svg"
                    alt="Chrome"
                    className="w-5 h-5"
                  />
                  <span>Free in web browser (ie. Google Chrome)</span>
                </div>
              </label>
              <div className="text-base-content/70 ml-10 mb-6">
                <span>
                  Free, less accurate, works best in Chrome. <br />
                  <em>Auto-punctuation and custom words may not work.</em>
                  <br />
                  <a
                    href="https://www.google.com/chrome/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Learn more about Google Chrome.
                  </a>
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="microsoft"
                    className="radio radio-primary"
                    {...register("speechProvider")}
                  />
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/icons8-azure.svg"
                      alt="Azure"
                      className="w-5 h-5"
                    />
                    <span>Microsoft Azure</span>
                  </div>
                </label>
                <div className="text-base-content/70 ml-10 mb-6">
                  <span>
                    Best for custom word recognition. <br />
                    <a
                      href="https://azure.microsoft.com/en-us/products/ai-services/ai-speech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Learn more about Microsoft Azure Speech-to-Text.
                    </a>
                  </span>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="assemblyai"
                    className="radio radio-primary"
                    {...register("speechProvider")}
                  />
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/assemblyai.png"
                      alt="AssemblyAI"
                      className="w-5 h-5"
                    />
                    <span>AssemblyAI</span>
                  </div>
                </label>
                <div className="text-base-content/70 ml-10">
                  <span>
                    Best for auto-punctuation and long-form writing. <br />
                    <a
                      href="https://www.assemblyai.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Learn more about AssemblyAI.
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Azure Credentials */}
          {selectedProvider === "microsoft" && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <img
                    src="/icons/icons8-azure.svg"
                    alt="Azure"
                    className="w-5 h-5"
                  />
                  Azure Speech Service Credentials
                </h2>
                <p className="text-base-content/70 mb-4">
                  Configure your Azure Speech Service credentials.
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

          {/* AssemblyAI Credentials */}
          {selectedProvider === "assemblyai" && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <img
                    src="/icons/assemblyai.png"
                    alt="AssemblyAI"
                    className="w-5 h-5"
                  />
                  AssemblyAI Credentials
                </h2>
                <p className="text-base-content/70 mb-4">
                  Configure your AssemblyAI API key.
                </p>

                <div className="space-y-4">
                  <FormInput
                    name="assemblyAIKey"
                    label="AssemblyAI API Key"
                    type="password"
                    placeholder="Enter your AssemblyAI API key"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Punctuation Settings */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Punctuation
              </h2>
              <p className="text-base-content/70 mb-4">
                Choose how punctuation should be handled.
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    className="radio radio-primary"
                    defaultChecked={getSettings().autoPunctuation === "true"}
                    {...register("autoPunctuation")}
                  />
                  <p className="flex flex-col">
                    <span>Auto punctuation</span>
                    <span className="text-sm text-base-content/70">
                      "I like pie" &rarr; I like pie.
                    </span>
                  </p>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    className="radio radio-primary"
                    defaultChecked={getSettings().autoPunctuation === "false"}
                    {...register("autoPunctuation")}
                  />
                  <p className="flex flex-col">
                    <span>Verbal punctuation</span>
                    <span className="text-sm text-base-content/70">
                      "I like pie period" &rarr; I like pie.
                    </span>
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Custom Words */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5" />
                Custom Words
              </h2>
              <p className="text-base-content/70 mb-4">
                Add custom words or phrases to recognize.
              </p>

              <div className="form-control w-full">
                <label htmlFor={customWordsId} className="label">
                  <span className="label-text">(comma-separated)</span>
                </label>
                <textarea
                  id={customWordsId}
                  className="textarea textarea-bordered w-full"
                  placeholder="e.g., TaterTalk, Jabberwocky, supercalifragilisticexpialidocious"
                  rows={4}
                  {...register("customWords")}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link to="/" className="btn btn-outline xs:btn-lg">
              Back
            </Link>

            <button type="submit" className="btn btn-primary xs:btn-lg gap-2">
              <CheckIcon className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default SettingsPage
