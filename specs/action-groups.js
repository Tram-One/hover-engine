/* eslint-disable no-unused-expressions */
module.exports.singleActionGroup = (spies) => Object({
  A: {
    init: () => {
      spies && spies.init && spies.init()
      return 0
    },
    increment: (state) => {
      spies && spies.increment && spies.increment()
      return state + 1
    }
  }
})

module.exports.multipleActionGroups = (spies) => Object({
  A: {
    init: () => {
      spies && spies.a.init && spies.a.init()
      return 0
    },
    increment: (state) => {
      spies && spies.a.increment && spies.a.increment()
      return state + 1
    }
  },
  B: {
    init: () => {
      spies && spies.b.init && spies.b.init()
      return 0
    },
    increment: (state) => {
      spies && spies.b.increment && spies.b.increment()
      return state + 1
    }
  }
})

module.exports.differentActionGroups = (spies) => Object({
  A: {
    init: () => {
      spies && spies.a.init && spies.a.init()
      return 0
    },
    increment: (state) => {
      spies && spies.a.increment && spies.a.increment()
      return state + 1
    }
  },
  B: {
    init: () => {
      spies && spies.b.init && spies.b.init()
      return 0
    },
    decrement: (state) => {
      spies && spies.b.decrement && spies.b.decrement()
      return state - 1
    }
  }
})

module.exports.argsActionGroup = (spies) => Object({
  A: {
    init: () => {
      spies && spies.init && spies.init()
      return 0
    },
    increment: (state, value, actions) => {
      spies && spies.increment && spies.increment(state, value, actions)
      return state + 1
    }
  }
})

module.exports.chainActionGroup = (spies) => Object({
  A: {
    init: () => {
      spies && spies.init && spies.init()
      return 0
    },
    increment: (state) => {
      spies && spies.increment && spies.increment(state)
      return state + 1
    },
    chainIncrement: (state, value, actions) => {
      spies && spies.increment && spies.increment()
      actions.increment()
    }
  }
})
