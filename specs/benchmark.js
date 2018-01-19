const HoverEngine = require('../hover-engine')
const watch = require('./stop-watch')
const ag = require('./action-groups')

let engine

const setupEngine = (numberOfActionGroups, numberOfActions) => () => {
  engine = new HoverEngine()
  const actionGroups = ag.buildRandomActionGroups(numberOfActionGroups, numberOfActions)
  engine.addActions(actionGroups)
}

const counterActionGroup = {
  counter: {
    init: () => 0,
    increment: (state) => state + 1,
    decrement: (state) => state - 1
  }
}

const testRuns = 1000
const loads = [
  ['No     Load', 1],
  ['Light  Load', 20],
  ['Medium Load', 100],
  ['Heavy  Load', 500]
]

loads.forEach((load) => {
  watch(`${load[0]} (Action Groups)\taddActions`, () => {
    engine.addActions(counterActionGroup)
  }, testRuns, 90, setupEngine(load[1], 20))
})

loads.forEach((load) => {
  watch(`${load[0]} (Actions)\taddActions`, () => {
    engine.addActions(counterActionGroup)
  }, testRuns, 90, setupEngine(20, load[1]))
})

loads.forEach((load) => {
  watch(`${load[0]} (Action Groups)\tcallAction`, () => {
    engine.actions.init()
  }, testRuns, 90, setupEngine(load[1], 20))
})

loads.forEach((load) => {
  watch(`${load[0]} (Actions)\tcallAction`, () => {
    engine.actions.init()
  }, testRuns, 90, setupEngine(20, load[1]))
})
