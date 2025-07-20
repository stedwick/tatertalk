import { produce } from "immer"
import { create, type StoreApi, type UseBoundStore } from "zustand"

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <T extends UseBoundStore<StoreApi<object>>>(
  store: T,
): WithSelectors<T> => {
  const storeWithSelectors = store as WithSelectors<T>
  // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic store selector creation
  storeWithSelectors.use = {} as any
  for (const k of Object.keys(store.getState())) {
    // biome-ignore lint/suspicious/noExplicitAny: Required for dynamic property assignment
    ;(storeWithSelectors.use as any)[k] = () =>
      store((s) => s[k as keyof typeof s])
  }

  return storeWithSelectors
}

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) =>
    set(
      produce((state) => {
        state.bears += by
      }),
    ),
}))

const useBearStore = createSelectors(useBearStoreBase)

export { useBearStore }
