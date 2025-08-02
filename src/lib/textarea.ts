// Types
export interface TextAreaContext {
  before: string
  text: string
  after: string
}

/**
 * Reads the content of a textarea element and returns a PunctuationContext.
 * The context includes the text before the selection, the selected text, and the text after the selection.
 * If there is no selection, the 'text' property will be an empty string, and 'before' and 'after'
 * will represent the content around the cursor.
 * @param element The HTMLTextAreaElement to read from.
 * @returns A PunctuationContext object.
 */
export const readFromTextArea = (
  element: HTMLTextAreaElement,
): TextAreaContext => {
  const { value, selectionStart, selectionEnd } = element

  const before = value.substring(0, selectionStart)
  const text = value.substring(selectionStart, selectionEnd)
  const after = value.substring(selectionEnd)

  return { before, text, after }
}

// To work with React controlled components, we need to simulate an input event.
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLTextAreaElement.prototype,
  "value",
)?.set

/**
 * Writes new text into a textarea element based on a PunctuationContext.
 * This function replaces the original 'text' part of the context with the provided new text,
 * reconstructs the full content, and updates the textarea.
 * It also dispatches an 'input' event to ensure compatibility with frameworks like React.
 * Finally, it sets the cursor position to the end of the newly inserted text and focuses the element.
 * @param element The HTMLTextAreaElement to write to.
 * @param context The PunctuationContext object representing the original state.
 */

// NOTE: On mobile, we'd like the keyboard NOT to show up when dictating.
export const writeToTextArea = (
  element: HTMLTextAreaElement,
  context: TextAreaContext,
): void => {
  const { before, after, text } = context
  const newValue = `${before}${text}${after}`

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(element, newValue)
  } else {
    element.value = newValue
  }

  // Set the cursor position after the newly inserted text
  const newCursorPosition = (before + text).length
  element.selectionStart = before.length
  element.selectionEnd = newCursorPosition
  // scrolls to new text
  element.blur()
  element.focus()

  const event = new Event("input", { bubbles: true })
  element.dispatchEvent(event)
}
