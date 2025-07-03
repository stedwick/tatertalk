# TypeScript-Based Punctuation System

This is a functional punctuation system built with pure TypeScript that transforms spoken dialogue into properly punctuated text.

## Features

- **Pure Functions**: Each transformation step is a pure function
- **Composable**: Easy to add, remove, or reorder transformation steps using function composition
- **Type Safe**: Full TypeScript support with proper type inference
- **Synchronous**: No async operations, immediate results
- **Testable**: Each step can be tested independently
- **Functional Pipeline**: Uses function composition for clean data flow

## Usage

### Basic Usage

```typescript
import { punctuate } from "./punctuation"

// Simple text processing
const result = punctuate("hello comma world")
console.log(result) // "hello, world"
```

### Advanced Usage with Context

```typescript
import { punctuateText, PunctuationContext } from "./punctuation"

const context: PunctuationContext = {
  before: "Hello",
  text: "comma world period",
  after: " there"
}

const result = punctuateText(context)
console.log(result) // ", world."
```

## Transformation Pipeline

The system applies transformations in this specific order using a functional pipeline:

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
bun test src/effect/punctuation.test.ts
```

## Architecture

### Function Composition Approach
- Pure functional pipeline using a custom `pipe` function
- Each step is a separate function that takes and returns a `PunctuationContext`
- Clear data flow through function composition
- Easy to test individual steps
- No side effects or mutations

### Pipeline Helper

The system uses a simple `pipe` helper function for composing transformations:

```typescript
const pipe = <T>(value: T, ...functions: Array<(arg: T) => T>): T => {
  return functions.reduce((acc, fn) => fn(acc), value)
}
```

This allows for clean, readable transformation chains:

```typescript
const result = pipe(
  input,
  trimText,
  preserveSpecialCases,
  addSpaceBefore,
  applyPunctuationMap,
  // ... more transformations
)
```

## Performance

The TypeScript-based version provides:
- **Fast execution**: Synchronous operations with no async overhead
- **Memory efficient**: Immutable transformations with structural sharing
- **Predictable**: No state machine complexity
- **Lightweight**: No external dependencies beyond TypeScript

## Comparison with Previous Approaches

### XState Approach
- State machine with complex state transitions
- Actions modify context in place
- Harder to test individual steps
- More complex debugging

### Effect Approach
- Functional pipeline with Effect monads
- Type-safe error handling
- Async-capable but overkill for this use case
- Additional dependency overhead

### TypeScript Approach (Current)
- Pure functional pipeline
- Simple function composition
- Synchronous and fast
- Easy to understand and debug
- Zero dependencies
- Perfect for this domain

## Error Handling

While the system doesn't need complex error handling for text transformation, individual functions can be wrapped with try-catch if needed:

```typescript
const safeTransform = (fn: (ctx: PunctuationContext) => PunctuationContext) => 
  (ctx: PunctuationContext): PunctuationContext => {
    try {
      return fn(ctx)
    } catch (error) {
      console.warn('Transform failed:', error)
      return ctx // Return unchanged on error
    }
  }
```

## Extending the System

Adding new transformations is straightforward:

```typescript
const customTransform = (context: PunctuationContext): PunctuationContext => ({
  ...context,
  text: context.text.replace(/custom pattern/g, 'replacement')
})

// Add it to the pipeline
export const punctuateText = (input: PunctuationContext): string => {
  const result = pipe(
    input,
    trimText,
    preserveSpecialCases,
    customTransform, // <-- Add here
    // ... rest of pipeline
  )
  
  return result.text
}
``` 