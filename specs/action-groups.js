/* eslint-disable no-unused-expressions */
module.exports.singleActionGroup = (spies) => ({
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

module.exports.multipleActionGroups = (spies) => ({
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

module.exports.differentActionGroups = (spies) => ({
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

module.exports.argsActionGroup = (spies) => ({
  A: {
    init: () => {
      spies && spies.init && spies.init()
      return 0
    },
    increment: (state, value, actions) => {
      spies && spies.increment && spies.increment(state, value, actions)
      return state + value
    }
  }
})

module.exports.chainActionGroup = (spies) => ({
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
      return state + 1
    }
  }
})

module.exports.multipleChainActionGroups = (spies) => ({
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
      return state + 1
    }
  },
  B: {
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
      return state + 1
    }
  }
})

const buildRandomActionGroup = (name, numberOfActions) => ({
  [name]: (Array(numberOfActions).fill().reduce((actions, _, index) => {
    actions[`increment_${index}`] = (state) => state + index
    return actions
  }, {init: () => 0}))
})

const buildRandomActionGroups = (numberOfActionGroups, numberOfActions) => (
  Array(numberOfActionGroups).fill().reduce((actionGroups, _, index) => {
    actionGroups[`counter_${index}`] = buildRandomActionGroup(`counter_${index}`, numberOfActions)[`counter_${index}`]
    return actionGroups
  }, {})
)

module.exports.buildRandomActionGroup = buildRandomActionGroup
module.exports.buildRandomActionGroups = buildRandomActionGroups
