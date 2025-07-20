import { describe, expect, test } from "bun:test"
import {
  type PunctuationContext,
  punctuate,
  punctuateText,
} from "./punctuation"

describe("Punctuation System", () => {
  test("Basic punctuation", () => {
    const result = punctuate("hello comma world")
    expect(result).toBe("Hello, world")
  })

  test("Question mark", () => {
    const result = punctuate("what is your name question mark")
    expect(result).toBe("What is your name?")
  })

  test("Smiley face", () => {
    const result = punctuate("I am happy smiley face")
    expect(result).toBe("I am happy :)")
  })

  test("With context", () => {
    const context: PunctuationContext = {
      before: "Hello",
      text: "comma world period",
      after: " there",
    }
    const result = punctuateText(context)
    expect(result).toBe(", world.")
  })

  test("Complex sentence", () => {
    const complexText =
      "Wow exclamation mark Can you believe it question mark exclamation mark The package open parentheses dollar sign 49 period 99 plus taxes close parentheses arrived at 3 colon 30 p period m period dash but it was empty ellipsis hashtag disappointed frowny face Email me at philip at sign gmail period com"
    const result = punctuate(complexText)
    expect(result).toBe(
      "Wow! Can you believe it?! The package ($49. 99 plus taxes) arrived at 3: 30 p. M. Dash but it was empty... #disappointed :( Email me at philip@gmail. Com",
    )
  })

  test("Capitalization", () => {
    const result = punctuate("hello world period goodbye world", "", " there")
    expect(result).toBe("Hello world. Goodbye world")
  })

  test("Multiple punctuation marks", () => {
    const result = punctuate("hello comma world period goodbye world")
    expect(result).toBe("Hello, world. Goodbye world")
  })

  test("Special characters", () => {
    const result = punctuate("my email is john at sign gmail period com")
    expect(result).toBe("My email is john@gmail. Com")
  })

  test("Hashtags", () => {
    const result = punctuate("I love hashtag programming")
    expect(result).toBe("I love #programming")
  })

  test("Percent sign spacing", () => {
    const result = punctuate("the discount is 20 percent sign off")
    expect(result).toBe("The discount is 20% off")
  })

  test("Empty text", () => {
    const result = punctuate("")
    expect(result).toBe("")
  })

  test("Only spaces", () => {
    const result = punctuate("   ")
    expect(result).toBe("")
  })

  test("Apostrophe s", () => {
    const result = punctuate("John apostrophe s car")
    expect(result).toBe("John's car")
  })

  test("Quotations", () => {
    const result = punctuate(
      "He said star quotations hello world finish quotations",
    )
    expect(result).toBe('He said "hello world"')
  })

  test("En dash", () => {
    const result = punctuate("the score was 10 dash sign 5")
    expect(result).toBe("The score was 10–5")
  })
})
