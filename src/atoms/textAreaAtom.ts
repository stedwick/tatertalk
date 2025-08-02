import { atomWithStorage } from "jotai/utils"

const textAreaAtom = atomWithStorage<string>("textArea", "", undefined, {
  getOnInit: true,
})

export { textAreaAtom }
