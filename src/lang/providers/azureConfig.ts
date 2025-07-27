/**
 * Azure Speech Service configuration utilities
 */

import { getSettings } from "../../lib/settings"

export interface AzureCredentials {
  key: string
  region: string
}

/**
 * Get Azure Speech Service credentials from localStorage
 */
export const getAzureCredentials = (): AzureCredentials | null => {
  const settings = getSettings()

  if (!settings.azureSpeechKey || !settings.azureSpeechRegion) {
    return null
  }

  return {
    key: settings.azureSpeechKey,
    region: settings.azureSpeechRegion,
  }
}
