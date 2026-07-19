import { atomWithStorage } from "jotai/utils"

const aiProofreadingEnabledAtom = atomWithStorage<boolean>(
  "aiProofreadingEnabled",
  false,
  undefined,
  {
    getOnInit: true,
  },
)

export { aiProofreadingEnabledAtom }
