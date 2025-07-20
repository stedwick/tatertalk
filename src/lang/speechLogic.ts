import { fromPromise, setup } from "xstate"

const _promiseLogic = fromPromise(async () => {
  /* ... */
})

const _machine = setup({
  types: {
    context: {} as {
      count: number
    },
    events: {} as
      | { type: "inc" }
      | { type: "dec" }
      | { type: "incBy"; amount: number }
      | { type: "notify"; message: string }
      | { type: "handleChange" }
      | { type: "canBeToggled" }
      | { type: "isAfterTime"; time: string },
  },
  actors: {
    _promiseLogic,
  },
}).createMachine({
  context: {
    count: 0,
  },
  // ... rest of machine configuration
})

export default _machine