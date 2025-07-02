import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { punctuate, punctuateText, PunctuationContext } from "./punctuation"

describe("Punctuation System", () => {
  test("Basic punctuation", async () => {
    const result = await Effect.runPromise(punctuate("hello comma world"))
    expect(result).toBe("Hello, world")
  })

  test("Question mark", async () => {
    const result = await Effect.runPromise(punctuate("what is your name question mark"))
    expect(result).toBe("What is your name?")
  })

  test("Smiley face", async () => {
    const result = await Effect.runPromise(punctuate("I am happy smiley face"))
    expect(result).toBe("I am happy :)")
  })

  test("With context", async () => {
    const context: PunctuationContext = {
      before: "Hello",
      text: "comma world period",
      after: " there"
    }
    const result = await Effect.runPromise(punctuateText(context))
    expect(result).toBe(", world.")
  })

  test("Complex sentence", async () => {
    const complexText = "Wow exclamation mark Can you believe it question mark exclamation mark The package open parentheses dollar sign 49 period 99 plus taxes close parentheses arrived at 3 colon 30 p period m period dash but it was empty ellipsis hashtag disappointed frowny face Email me at philip at sign gmail period com"
    const result = await Effect.runPromise(punctuate(complexText))
    expect(result).toBe("Wow! Can you believe it?! The package ($49. 99 plus taxes) arrived at 3: 30 p. M. Dash but it was empty... #disappointed :( Email me at philip@gmail. Com")
  })

  test("Capitalization", async () => {
    const result = await Effect.runPromise(punctuate("hello world period goodbye world", "", " there"))
    expect(result).toBe("Hello world. Goodbye world")
  })

  test("Multiple punctuation marks", async () => {
    const result = await Effect.runPromise(punctuate("hello comma world period goodbye world"))
    expect(result).toBe("Hello, world. Goodbye world")
  })

  test("Special characters", async () => {
    const result = await Effect.runPromise(punctuate("my email is john at sign gmail period com"))
    expect(result).toBe("My email is john@gmail. Com")
  })

  test("Hashtags", async () => {
    const result = await Effect.runPromise(punctuate("I love hashtag programming"))
    expect(result).toBe("I love #programming")
  })

  test("Percent sign spacing", async () => {
    const result = await Effect.runPromise(punctuate("the discount is 20 percent sign off"))
    expect(result).toBe("The discount is 20% off")
  })
})
