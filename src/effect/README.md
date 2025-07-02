# Effect-Based Punctuation System

This is a functional rewrite of the XState-based punctuation machine using the Effect library. It transforms spoken dialogue into properly punctuated text.

## Features

- **Pure Functions**: Each transformation step is a pure function wrapped in Effect
- **Composable**: Easy to add, remove, or reorder transformation steps
- **Type Safe**: Full TypeScript support with proper type inference
- **Error Handling**: Built-in error handling through Effect's error channel
- **Testable**: Each step can be tested independently

## Usage

### Basic Usage

```typescript
import { Effect } from "effect"
import { punctuate } from "./punctuation"

// Simple text processing
const result = await Effect.runPromise(punctuate("hello comma world"))
console.log(result) // "hello, world"
```

### Advanced Usage with Context

```typescript
import { Effect } from "effect"
import { punctuateText, PunctuationContext } from "./punctuation"

const context: PunctuationContext = {
  before: "Hello",
  text: "comma world period",
  after: " there"
}

const result = await Effect.runPromise(punctuateText(context))
console.log(result) // "Hello, world. there"
```

## Transformation Pipeline

The system applies transformations in this specific order:

1. **Trim** - Remove leading/trailing whitespace
2. **Preserve Special Cases** - Temporarily replace a.m./p.m.
3. **Add Space Before** - Add space if needed before the text
4. **Add Space After** - Add space if needed after the text
5. **Apply Punctuation Map** - Replace spoken punctuation with symbols
6. **Apply Special Rules** - Handle quotes, apostrophes, dashes
7. **Capitalize First Letter** - Capitalize if sentence start
8. **Capitalize Within Utterance** - Capitalize after sentence endings
9. **Remove Spaces Before** - Remove spaces before certain characters
10. **Remove Spaces After** - Remove spaces after certain characters
11. **Remove All Spaces** - Remove spaces around certain characters
12. **Apply Smiley Map** - Replace spoken smileys with emoticons
13. **Downcase Hashtags** - Convert hashtags to lowercase
14. **Restore Special Cases** - Put back a.m./p.m.
15. **Trim Multi-line** - Clean up newline spacing

## Supported Punctuation

### Basic Punctuation
- `comma` → `,`
- `period` → `.`
- `question mark` → `?`
- `exclamation mark` → `!`
- `open parentheses` → `(`
- `close parentheses` → `)`
- `new paragraph` → `\n\n`

### Advanced Punctuation
- `at sign` → `@`
- `hashtag` → `#`
- `dollar sign` → `$`
- `percent sign` → `%`
- `ampersand` → `&`
- `asterisk` → `*`
- `underscore` → `_`
- `plus sign` → `+`
- `forward slash` → `/`
- `backslash` → `\`
- `less than sign` → `<`
- `greater than sign` → `>`
- `pipe character` → `|`
- `open bracket` → `[`
- `close bracket` → `]`
- `open brace` → `{`
- `close brace` → `}`
- `equal sign` → `=`
- `ellipsis` → `...`
- `trademark sign` → `™`

### Smileys
- `smiley face` → `:)`
- `winky face` → `;)`
- `frowny face` → `:(`
- `tongue face` → `:P`

### Special Commands
- `star quotations` → `"`
- `finish quotations` → `"`
- `apostrophe s` → `'s`
- `dash sign` → `–` (en dash)

## Testing

Run the test file to see examples:

```bash
npx tsx src/effect/punctuation.test.ts
```

## Comparison with XState

### XState Approach
- State machine with complex state transitions
- Actions modify context in place
- Harder to test individual steps
- More complex debugging

### Effect Approach
- Pure functional pipeline
- Each step is a separate Effect
- Easy to test individual steps
- Clear data flow
- Better error handling
- More composable

## Error Handling

The Effect-based approach provides better error handling:

```typescript
import { Effect } from "effect"
import { punctuate } from "./punctuation"

const program = punctuate("hello comma world")
  .pipe(Effect.catchAll(error => Effect.succeed(`Error: ${error}`)))

const result = await Effect.runPromise(program)
```

## Performance

The Effect-based version should have similar performance to the XState version, but with better memory usage due to immutable transformations and no state machine overhead. 