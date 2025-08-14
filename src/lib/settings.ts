export interface AppSettings {
  speechProvider: "microsoft" | "browser" | "assemblyai"
  azureSpeechKey: string
  azureSpeechRegion: string
  assemblyAIKey: string
  autoPunctuation: "true" | "false"
  customWords: string
}

const DEFAULT_SETTINGS: AppSettings = {
  speechProvider: "browser",
  azureSpeechKey: "",
  azureSpeechRegion: "",
  assemblyAIKey: "",
  autoPunctuation: "false",
  customWords: "",
}

const SETTINGS_KEY = "tatertalk_settings"

/**
 * Get settings from localStorage
 */
export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error("Error loading settings:", error)
  }
  return { ...DEFAULT_SETTINGS }
}

/**
 * Save settings to localStorage
 */
export const saveSettings = (newSettings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getSettings()
    const updatedSettings = { ...currentSettings, ...newSettings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings))
  } catch (error) {
    console.error("Error saving settings:", error)
  }
}
