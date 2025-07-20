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
  tilde: "~",
  backtick: "`",
  "at sign": "@",
  hashtag: "#",
  "dollar sign": "$",
  "percent sign": "%",
  "carrot sign": "^",
  ampersand: "&",
  asterisk: "*",
  underscore: "_",
  "plus sign": "+",
  "forward slash": "/",
  backslash: "\\",
  "less than sign": "<",
  "greater than sign": ">",
  "bar sign": "|",
  "pipe character": "|",
  "open bracket": "[",
  "close bracket": "]",
  "open brace": "{",
  "close brace": "}",
  "equal sign": "=",
  ellipsis: "...",
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
  `\\b(${Object.keys(punctuationMap).join("|")})\\b`,
  "gi",
)
const smileyRegex = new RegExp(
  `\\b(${Object.keys(smileyMap).join("|")})\\b`,
  "gi",
)

// Character spacing rules
const charsWithNoSpaces = "_\\-@/\\\\–"
const charsWithOnlySpaceBefore = "(#${\\["
const charsWithOnlySpaceAfter = ",.:;?!%)}\\]™"
const charsThatCapitalizeNext = ".?!\\n"

const charsWithNoSpacesRegex = new RegExp(
  `\\s*([${charsWithNoSpaces}])\\s*`,
  "g",
)
const charsWithOnlySpaceBeforeRegex = new RegExp(
  `([${charsWithOnlySpaceBefore}])\\s+`,
  "g",
)
const charsWithOnlySpaceAfterRegex = new RegExp(
  `\\s+([${charsWithOnlySpaceAfter}])`,
  "g",
)
const charsThatCapitalizeNextRegex = new RegExp(
  `([${charsThatCapitalizeNext}]\\W+)(\\w)`,
  "g",
)

const capitalizeNextRegex = new RegExp(`(^|[${charsThatCapitalizeNext}])\\W*$`)
const spaceComesNextRegex = new RegExp(
  `[^\\s${charsWithOnlySpaceBefore}${charsWithNoSpaces}]$`,
)
const spaceComesBeforeRegex = new RegExp(`^[^\\s${charsWithOnlySpaceAfter}]`)

const debugLog = false

// Text transformation functions
const trimText = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.text.trim(),
})

const preserveSpecialCases = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text
    .replace(/a\.m\./g, "xxAAMMxx")
    .replace(/p\.m\./g, "xxPPMMxx"),
})

const addSpaceBefore = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.before.match(spaceComesNextRegex)
    ? ` ${context.text}`
    : context.text,
})

const addSpaceAfter = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.after.match(spaceComesBeforeRegex)
    ? `${context.text} `
    : context.text,
})

const applyPunctuationMap = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text.replace(punctuationRegex, (matched: string) => {
    const matchedLowerCase = matched.toLowerCase()
    const mappedValue = punctuationMap[matchedLowerCase]
    return mappedValue || matched
  }),
})

const applySpecialRules = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text
    .replace(/star.{1,10}quotations?\s*/gi, '"')
    .replace(/\s*finish.{1,10}quotations?/gi, '"')
    .replace(/\s*apostrophe(s| s)?/gi, "'s")
    .replace(/\bdash sign\b/gi, "–")
    .replace(/\b- sign\b/gi, "–"),
})

const capitalizeFirstLetter = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text:
    context.before === "" || context.before.match(capitalizeNextRegex)
      ? context.text.replace(/^\W*(\w)/, (char) => char.toUpperCase())
      : context.text,
})

const capitalizeWithinUtterance = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text.replace(
    charsThatCapitalizeNextRegex,
    (_match, p1, p2) => p1 + p2.toUpperCase(),
  ),
})

const removeSpacesBefore = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text.replace(charsWithOnlySpaceBeforeRegex, "$1"),
})

const removeSpacesAfter = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text.replace(charsWithOnlySpaceAfterRegex, "$1"),
})

const removeAllSpaces = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.text.replace(charsWithNoSpacesRegex, "$1"),
})

const applySmileyMap = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.text.replace(smileyRegex, (matched: string) => {
    const matchedLowerCase = matched.toLowerCase()
    const mappedValue = smileyMap[matchedLowerCase]
    return mappedValue || matched
  }),
})

const downcaseHashtags = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.text.replace(/#\w/g, (hashtag) => hashtag.toLowerCase()),
})

const restoreSpecialCases = (
  context: PunctuationContext,
): PunctuationContext => ({
  ...context,
  text: context.text.replace(/xxAAMMxx/g, "a.m.").replace(/xxPPMMxx/g, "p.m."),
})

const trimMultiLine = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.text.replace(/[^\S\n]*(\n+)[^\S\n]*/g, "$1"),
})

// Debug logging function (optional)
const debugLogStep =
  (stepName: string) =>
  (context: PunctuationContext): PunctuationContext => {
    if (debugLog) {
      console.log(`${stepName}: [${context.text}]`)
    }
    return context
  }

// Compose functions helper
const pipe = <T>(value: T, ...functions: Array<(arg: T) => T>): T => {
  return functions.reduce((acc, fn) => fn(acc), value)
}

// Main punctuation function
export const punctuateText = (input: PunctuationContext): string => {
  const result = pipe(
    input,
    trimText,
    preserveSpecialCases,
    debugLogStep("A.M.P.M."),
    addSpaceBefore,
    debugLogStep("space ."),
    addSpaceAfter,
    debugLogStep(". space"),
    applyPunctuationMap,
    debugLogStep("punc"),
    applySpecialRules,
    debugLogStep("special's"),
    capitalizeFirstLetter,
    debugLogStep("cap 1st"),
    capitalizeWithinUtterance,
    debugLogStep("end. cap"),
    removeSpacesBefore,
    debugLogStep("<space"),
    removeSpacesAfter,
    debugLogStep("space>"),
    removeAllSpaces,
    debugLogStep("no@space"),
    applySmileyMap,
    debugLogStep(":)"),
    downcaseHashtags,
    debugLogStep("#low"),
    restoreSpecialCases,
    debugLogStep("a.m.p.m."),
    trimMultiLine,
    debugLogStep("_trim_"),
  )

  return result.text
}

// Convenience function for simple text processing
export const punctuate = (
  text: string,
  before: string = "",
  after: string = "",
): string => punctuateText({ before, text, after })

// Example usage:
// const result = punctuate("hello comma world", "Hello", " there")
// console.log(result) // "Hello, world"
