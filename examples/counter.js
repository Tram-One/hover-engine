const HoverEngine = require('../hover-engine')

const numberActions = {
  init: () => 0,
  add: (state, value) => state + value,
  sub: (state, value) => state - value
}

const engine = new HoverEngine()
engine.addActions({num: numberActions})
engine.addListener((store, actions, actionName, actionArguments) => {
  console.log(actionName, actionArguments, '->', store)
})

engine.actions.add(5) // add 5 -> { num: 5 }
engine.actions.add(8) // add 8 -> { num: 13 }
engine.actions.sub(5) // sub 5 -> { num: 8 }
console.log(engine.store) // { num: 8 }
