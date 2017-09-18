const HoverEngine = require('../hover-engine')

const numberActions = {
  init: () => 0,
  add: (state, value) => state + value
}

const stringActions = {
  init: () => '',
  add: (state, value) => state + value.toString()
}

const engine = new HoverEngine()
engine.addActions({
  num: numberActions,
  str: stringActions
})

engine.addListener((state) => console.log('NEW STATE:', state))

engine.actions.add(5) // -> NEW STATE: { num: 5,  str: '5' }
engine.actions.add(8) // -> NEW STATE: { num: 13, str: '58' }
engine.actions.add(5) // -> NEW STATE: { num: 18, str: '585' }
