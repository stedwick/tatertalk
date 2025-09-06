export interface AppSettings {
  speechProvider: "microsoft" | "browser" | "assemblyai"
  azureSpeechKey: string
  azureSpeechRegion: string
  assemblyAIKey: string
  autoPunctuation: "true" | "false"
  customWords: string
  openRouterApiKey: string
  aiProofreadingPrompt: string
}

export const DEFAULT_AI_PROMPT = `Reformat the speech-to-text transcript using minimal edits.

CORE PRINCIPLE: Preserve original text. Only fix clear errors.

RULES:
1. **Spelling**: Fix only obvious typos where intent is certain
   - "Slak" → "Slack" ✓
   - "there" → "their" ✗ (context-dependent, skip)

2. **Self-corrections**: Apply speaker's own corrections
   - "at 8pm actually 9pm" → "at 9pm"
   - "no wait I meant Tuesday" → "Tuesday"

3. **Format conversions**:
   - "john at example dot com" → "john@example.com"
   - "h t t p s colon slash slash example dot com" → "https://example.com"

4. **Add punctuation**: Voice dictation is often stream of consciousness with run on sentences, so add punctuation where it makes sense. But don't use em dashes like —.
   - "I didnt know chicken could be so ******* hard Thats a mess Whats the AI gonna do with that Were supposed to have just a normal conversation the two of us you know drinking my coffee with a sleeping Sophie the dog between us" → "I didn't know chicken could be so ******* hard. That's a mess. What's the AI gonna do with that? We're supposed to have just a normal conversation, the two of us, you know, drinking my coffee with a sleeping Sophie, the dog, between us."

5. **Preserve everything else**: Tone, slang, fragments, filler words

OUTPUT: Return ONLY the corrected text. No explanations.
`

const DEFAULT_SETTINGS: AppSettings = {
  speechProvider: "browser",
  azureSpeechKey: "",
  azureSpeechRegion: "",
  assemblyAIKey: "",
  autoPunctuation: "false",
  customWords: "",
  openRouterApiKey: "",
  aiProofreadingPrompt: DEFAULT_AI_PROMPT,
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

export const getCustomWords = (): string[] => {
  const settings = getSettings()
  return settings.customWords
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
}
