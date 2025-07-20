/**
 * Azure Speech Service configuration utilities
 */

export interface AzureCredentials {
  key: string
  region: string
}

/**
 * Set Azure Speech Service credentials in localStorage
 */
export const setAzureCredentials = (credentials: AzureCredentials): void => {
  localStorage.setItem("AZURE_SPEECH_KEY", credentials.key)
  localStorage.setItem("AZURE_SPEECH_REGION", credentials.region)
}

/**
 * Get Azure Speech Service credentials from localStorage
 */
export const getAzureCredentials = (): AzureCredentials | null => {
  const key = localStorage.getItem("AZURE_SPEECH_KEY")
  const region = localStorage.getItem("AZURE_SPEECH_REGION")

  if (!key || !region) {
    return null
  }

  return { key, region }
}

/**
 * Clear Azure Speech Service credentials from localStorage
 */
export const clearAzureCredentials = (): void => {
  localStorage.removeItem("AZURE_SPEECH_KEY")
  localStorage.removeItem("AZURE_SPEECH_REGION")
}
