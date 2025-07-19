import { create, StoreApi, UseBoundStore } from 'zustand'
import { produce } from 'immer'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set(produce((state) => {
    state.bears += by
  })),
}))

const useBearStore = createSelectors(useBearStoreBase)

export { useBearStore }