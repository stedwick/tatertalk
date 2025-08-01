import { getSettings } from "../../lib/settings"

/**
 * Add custom phrases to the speech recognizer using grammars
 */
export const addCustomPhrases = (recognition: SpeechRecognition): void => {
  const settings = getSettings()

  // Add custom phrases if provided
  if (settings.customWords.trim()) {
    const customPhrases = settings.customWords
      .split(",")
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0)

    if (customPhrases.length > 0) {
      // Create a custom grammar with the phrases
      const grammarText = `#JSGF V1.0;
grammar customPhrases;
public <phrase> = ${customPhrases.join(" | ")};`

      try {
        const SpeechGrammarList =
          window.webkitSpeechGrammarList || window.SpeechGrammarList
        if (SpeechGrammarList) {
          const grammar = new SpeechGrammarList()
          grammar.addFromString(grammarText, 1.0)
          recognition.grammars = grammar
        }
      } catch (error) {
        console.warn("Could not add custom phrases grammar:", error)
        // Don't throw - just log the warning and continue without custom phrases
      }
    }
  }
}
