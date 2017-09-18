const HoverEngine = require('../hover-engine')

const numberActions = {
  init: () => 0,
  add: (state, value) => state + value,
  sub: (state, value) => state - value
}

const engine = new HoverEngine()
engine.addActions({ num: numberActions })
engine.addListener((store) => console.log('NEW STATE:', store))

engine.actions.add(5) // -> NEW STATE: { num: 5 }
engine.actions.add(8) // -> NEW STATE: { num: 13 }
engine.actions.sub(5) // -> NEW STATE: { num: 8 }
console.log(engine.store) // -> { num: 8 }
