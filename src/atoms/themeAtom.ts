import { atomWithStorage } from "jotai/utils"

// Set the string key and the initial value
const themeAtom = atomWithStorage("theme", "light")

export { themeAtom }
