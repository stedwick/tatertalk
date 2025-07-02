import { Effect } from "effect"

// Types
export interface PunctuationContext {
  before: string
  text: string
  after: string
}

// Punctuation mappings
const punctuationMap: Record<string, string> = {
  // Basic punctuation
  comma: ",",
  period: ".",
  colon: ":",
  semicolon: ";",
  hyphen: "-",
  "question mark": "?",
  "exclamation mark": "!",
  "exclamation point": "!",
  "open parentheses": "(",
  "close parentheses": ")",
  "new paragraph": "\n\n",

  // Advanced punctuation
  "tilde": "~",
  "backtick": "`",
  "at sign": "@",
  "hashtag": "#",
  "dollar sign": "$",
  "percent sign": "%",
  "carrot sign": "^",
  "ampersand": "&",
  "asterisk": "*",
  "underscore": "_",
  "plus sign": "+",
  "forward slash": "/",
  "backslash": "\\",
  "less than sign": "<",
  "greater than sign": ">",
  "bar sign": "|",
  "pipe character": "|",
  "open bracket": "[",
  "close bracket": "]",
  "open brace": "{",
  "close brace": "}",
  "equal sign": "=",
  "ellipsis": "...",
  "trademark sign": "™",
}

const smileyMap: Record<string, string> = {
  // Smileys
  "smiley face": ":)",
  "smiling face": ":)",
  "winky face": ";)",
  "winking face": ";)",
  "frowny face": ":(",
  "frowny-face": ":(",
  "frowning face": ":(",
  "tongue face": ":P",
  "tongue out face": ":P",
}

// Regex patterns
const punctuationRegex = new RegExp(
  '\\b(' + Object.keys(punctuationMap).join('|') + ')\\b',
  "gi"
)
const smileyRegex = new RegExp(
  '\\b(' + Object.keys(smileyMap).join('|') + ')\\b',
  "gi"
)

// Character spacing rules
const charsWithNoSpaces = "_\\-@/\\\\"
const charsWithOnlySpaceBefore = "(#${\\["
const charsWithOnlySpaceAfter = ",.:;?!%)}\\]™"
const charsThatCapitalizeNext = ".?!\\n"

const charsWithNoSpacesRegex = new RegExp(`\\s*([${charsWithNoSpaces}])\\s*`, "g")
const charsWithOnlySpaceBeforeRegex = new RegExp(`([${charsWithOnlySpaceBefore}])\\s+`, "g")
const charsWithOnlySpaceAfterRegex = new RegExp(`\\s+([${charsWithOnlySpaceAfter}])`, "g")
const charsThatCapitalizeNextRegex = new RegExp(`([${charsThatCapitalizeNext}]\\W+)(\\w)`, "g")

const capitalizeNextRegex = new RegExp(`(^|[${charsThatCapitalizeNext}])\\W*$`)
const spaceComesNextRegex = new RegExp(`[^\\s${charsWithOnlySpaceBefore}${charsWithNoSpaces}]$`)
const spaceComesBeforeRegex = new RegExp(`^[^\\s${charsWithOnlySpaceAfter}]`)

const debugLog = false

// Effect-based text transformation functions
const trimText = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.trim()
  }))

const preserveSpecialCases = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text
      .replace(/a\.m\./g, "xxAAMMxx")
      .replace(/p\.m\./g, "xxPPMMxx")
  }))

const addSpaceBefore = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.before.match(spaceComesNextRegex) ? " " + context.text : context.text
  }))

const addSpaceAfter = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.after.match(spaceComesBeforeRegex) ? context.text + " " : context.text
  }))

const applyPunctuationMap = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(punctuationRegex, (matched: string) => {
      const matchedLowerCase = matched.toLowerCase()
      const mappedValue = punctuationMap[matchedLowerCase]
      return mappedValue || matched
    })
  }))

const applySpecialRules = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text
      .replace(/star.{1,10}quotations?\s*/gi, '"')
      .replace(/\s*finish.{1,10}quotations?/gi, '"')
      .replace(/\s*apostrophe(s| s)?/gi, "'s")
      .replace(/\bdash sign\b/gi, "–")
      .replace(/\b- sign\b/gi, "–")
  }))

const capitalizeFirstLetter = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: (context.before === '' || context.before.match(capitalizeNextRegex))
      ? context.text.replace(/^\W*(\w)/, (char) => char.toUpperCase())
      : context.text
  }))

const capitalizeWithinUtterance = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(charsThatCapitalizeNextRegex, (_match, p1, p2) => p1 + p2.toUpperCase())
  }))

const removeSpacesBefore = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(charsWithOnlySpaceBeforeRegex, "$1")
  }))

const removeSpacesAfter = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(charsWithOnlySpaceAfterRegex, "$1")
  }))

const removeAllSpaces = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(charsWithNoSpacesRegex, "$1")
  }))

const applySmileyMap = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(smileyRegex, (matched: string) => {
      const matchedLowerCase = matched.toLowerCase()
      const mappedValue = smileyMap[matchedLowerCase]
      return mappedValue || matched
    })
  }))

const downcaseHashtags = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(/#\w/g, (hashtag) => hashtag.toLowerCase())
  }))

const restoreSpecialCases = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text
      .replace(/xxAAMMxx/g, "a.m.")
      .replace(/xxPPMMxx/g, "p.m.")
  }))

const trimMultiLine = (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => ({
    ...context,
    text: context.text.replace(/[^\S\n]*(\n+)[^\S\n]*/g, "$1")
  }))

// Debug logging effect (optional)
const debugLogStep = (stepName: string) => (context: PunctuationContext): Effect.Effect<PunctuationContext> =>
  Effect.sync(() => {
    if (debugLog) {
      console.log(`${stepName}: [${context.text}]`)
    }
    return context
  })

// Main punctuation effect
export const punctuateText = (input: PunctuationContext): Effect.Effect<string> =>
  Effect.succeed(input)
    .pipe(Effect.flatMap(trimText))
    .pipe(Effect.flatMap(preserveSpecialCases))
    .pipe(Effect.flatMap(debugLogStep("A.M.P.M.")))
    .pipe(Effect.flatMap(addSpaceBefore))
    .pipe(Effect.flatMap(debugLogStep("space .")))
    .pipe(Effect.flatMap(addSpaceAfter))
    .pipe(Effect.flatMap(debugLogStep(". space")))
    .pipe(Effect.flatMap(applyPunctuationMap))
    .pipe(Effect.flatMap(debugLogStep("punc")))
    .pipe(Effect.flatMap(applySpecialRules))
    .pipe(Effect.flatMap(debugLogStep("special's")))
    .pipe(Effect.flatMap(capitalizeFirstLetter))
    .pipe(Effect.flatMap(debugLogStep("cap 1st")))
    .pipe(Effect.flatMap(capitalizeWithinUtterance))
    .pipe(Effect.flatMap(debugLogStep("end. cap")))
    .pipe(Effect.flatMap(removeSpacesBefore))
    .pipe(Effect.flatMap(debugLogStep("<space")))
    .pipe(Effect.flatMap(removeSpacesAfter))
    .pipe(Effect.flatMap(debugLogStep("space>")))
    .pipe(Effect.flatMap(removeAllSpaces))
    .pipe(Effect.flatMap(debugLogStep("no@space")))
    .pipe(Effect.flatMap(applySmileyMap))
    .pipe(Effect.flatMap(debugLogStep(":)")))
    .pipe(Effect.flatMap(downcaseHashtags))
    .pipe(Effect.flatMap(debugLogStep("#low")))
    .pipe(Effect.flatMap(restoreSpecialCases))
    .pipe(Effect.flatMap(debugLogStep("a.m.p.m.")))
    .pipe(Effect.flatMap(trimMultiLine))
    .pipe(Effect.flatMap(debugLogStep("_trim_")))
    .pipe(Effect.map((context: PunctuationContext) => context.text))

// Convenience function for simple text processing
export const punctuate = (text: string, before: string = "", after: string = ""): Effect.Effect<string> =>
  punctuateText({ before, text, after })

// Example usage:
// const result = Effect.runSync(punctuate("hello comma world", "Hello", " there"))
// console.log(result) // "Hello, world"
