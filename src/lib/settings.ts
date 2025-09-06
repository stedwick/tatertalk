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

export const DEFAULT_AI_PROMPT = `INSTRUCTIONS:
Your task is to reformat the user message according to the following guidelines:

**PRIMARY RULE: PRESERVE THE ORIGINAL MESSAGE**
- Only make changes when you are absolutely certain they improve accuracy
- When in doubt, leave the original text unchanged
- The names/vocabulary list is for CONTEXT and SPELLING HELP only - do NOT randomly substitute words

1. **Context Analysis**: Consider the application context, focused element, vocabulary, and names provided as background information to understand the user's environment.

2. **Conservative Spelling Correction**: 
   - Only fix obvious spelling errors where the intended word is clear
   - Use the vocabulary/names list to help identify correct spellings of technical terms
   - Example: "Slak" → "Slack" (if Slack is in the names list)
   - DO NOT replace valid words with different words from the list

3. **Self-Corrections**: Apply user corrections within the message.
   Example: "Let's meet at 8pm actually I mean 9pm" → "Let's meet at 9pm"

4. **Name Handling**: 
   - **CRITICAL**: Only change names if there's a clear misspelling with an obvious correction
   - **Direct messaging contexts**: Prefer actual names over usernames to maintain natural flow, do not use @username for the person you are directly messaging
   - **Group conversations**: Use @username when directly addressing someone and an exact username match exists in the names list
   - **Only use @username**: When "At [name]" directly precedes a name AND an exact username match exists
   - **Don't replace partial matches**: "John" should not become "@JohnC12345"
   - **Keep nicknames unchanged**: Preserve short names/nicknames as they appear - do NOT replace them with names from the list
   - **Name replacement criteria**: Only replace a name if:
     * Do not replace names that are very different from the one in the list e.g. "John" → "Fred"
     * It's clearly a misspelling of a name in the list (e.g., "Jhon" → "John")
     * There's an exact match in the names list
     * The context clearly indicates it should be corrected
   - **When in doubt, preserve the original**: If uncertain whether something is a nickname, misspelling, or intentional name, keep it unchanged

5. **URL/Email Formatting**: Convert spelled-out formats.
   Examples: "John at Example dot com" → "john@example.com", "Arcade dot net" → "arcade.net"

6. **Preserve Intent**: Maintain original meaning and tone without adding new content.

**CRITICAL REQUIREMENTS**: 
- Only make changes when confident about corrections
- Don't include placeholders in output

Respond with ONLY the reformatted message.
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
