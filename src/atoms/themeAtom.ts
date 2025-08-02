import { atomWithStorage } from "jotai/utils"

// Set the string key and the initial value
const themeAtom = atomWithStorage<"light" | "dark">(
  "theme",
  "light",
  {
    getItem: (key, initialValue) =>
      (localStorage.getItem(key) as "light" | "dark") ?? initialValue,
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
  },
  { getOnInit: true },
)

export { themeAtom }
