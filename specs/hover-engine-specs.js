// we won't always have this file built, so don't depend on it to pass lint
// eslint-disable-next-line import/no-unresolved
const HoverEnginer = require('../dist/hover-engine')
const ag = require('./action-groups')

// asymmetric matcher for params that we don't care about
const whatever = {
  asymmetricMatch: () => true
}

describe('HoverEngine', () => {
  let engine
  beforeEach(() => {
    engine = new HoverEnginer()
  })

  describe('constructor', () => {
    it('builds a store', () => {
      expect(engine.store).toBeDefined()
    })

    it('builds actions', () => {
      expect(engine.actions).toBeDefined()
    })
  })

  describe('addActions', () => {
    describe('single action group', () => {
      it('should add action group to the store', () => {
        engine.addActions(ag.singleActionGroup())

        expect(engine.store.A).toBeDefined()
      })

      it('should call init action for action group', () => {
        const spies = {init: jasmine.createSpy('a.init')}
        engine.addActions(ag.singleActionGroup(spies))

        expect(spies.init).toHaveBeenCalled()
      })

      it('should add all the actions for action group', () => {
        const actionGroup = ag.singleActionGroup()
        engine.addActions(actionGroup)
        expect(Object.keys(engine.engine)).toEqual(Object.keys(actionGroup.A))
      })
    })

    describe('multiple action groups', () => {
      it('should add action groups to the store', () => {
        engine.addActions(ag.multipleActionGroups())

        expect(engine.store.A).toBeDefined()
        expect(engine.store.B).toBeDefined()
      })

      it('should compose same-name functions on actions', () => {
        const spies = {
          a: {increment: jasmine.createSpy('a.increment')},
          b: {increment: jasmine.createSpy('b.increment')}
        }

        engine.addActions(ag.multipleActionGroups(spies))
        engine.actions.increment()

        expect(spies.a.increment).toHaveBeenCalled()
        expect(spies.b.increment).toHaveBeenCalled()
      })

      it('should add all the actions for action groups', () => {
        const actionGroups = ag.differentActionGroups()
        engine.addActions(actionGroups)
        expect(Object.keys(engine.engine)).toContain('init')
        expect(Object.keys(engine.engine)).toContain('increment')
        expect(Object.keys(engine.engine)).toContain('decrement')
      })
    })

    it('should be chainable', () => {
      engine
        .addActions({A: ag.differentActionGroups().A})
        .addActions({B: ag.differentActionGroups().B})

      expect(engine.store.A).toBeDefined()
      expect(engine.store.B).toBeDefined()
    })
  })

  describe('addListener', () => {
    it('should add a listener to the engine', () => {
      const spy = jasmine.createSpy('listener')
      engine.addListener(spy)

      expect(engine.listeners).toContain(spy)
    })

    it('should be chainable', () => {
      const spyA = jasmine.createSpy('a.listener')
      const spyB = jasmine.createSpy('b.listener')
      engine
        .addListener(spyA)
        .addListener(spyB)

      expect(engine.listeners).toContain(spyA)
      expect(engine.listeners).toContain(spyB)
    })
  })

  describe('notifyListeners', () => {
    it('should call single listener', () => {
      const spy = jasmine.createSpy('listener')
      engine.addListener(spy)
      engine.addActions(ag.singleActionGroup())
      engine.notifyListeners()

      expect(spy).toHaveBeenCalled()
    })

    it('should call multiple listeners', () => {
      const spyA = jasmine.createSpy('listener')
      const spyB = jasmine.createSpy('listener')
      engine
        .addListener(spyA)
        .addListener(spyB)

      engine.addActions(ag.singleActionGroup())
      engine.notifyListeners()

      expect(spyA).toHaveBeenCalled()
      expect(spyB).toHaveBeenCalled()
    })

    it('should call listener with store, actions', () => {
      const listenerSpy = jasmine.createSpy('listener')
      engine.addActions(ag.singleActionGroup())
      engine.addListener(listenerSpy)
      engine.notifyListeners()
      expect(listenerSpy).toHaveBeenCalledWith(engine.store, engine.actions, whatever, whatever)
    })

    it('should call listener with updated store', () => {
      const listenerSpy = jasmine.createSpy('listener')
      engine.addActions(ag.singleActionGroup())
      engine.addListener(listenerSpy)
      engine.actions.increment()
      expect(listenerSpy).toHaveBeenCalledWith(jasmine.objectContaining({A: 1}), whatever, whatever, whatever)
    })

    it('should call listener with called action and action arguments', () => {
      const listenerSpy = jasmine.createSpy('listener')
      engine.addActions(ag.argsActionGroup())
      engine.addListener(listenerSpy)
      engine.actions.increment(5)
      expect(listenerSpy).toHaveBeenCalledWith(whatever, whatever, 'increment', 5)
    })

    it('should be chainable', () => {
      const spy = jasmine.createSpy('listener')
      engine.addListener(spy)
      engine.addActions(ag.singleActionGroup())
      engine
        .notifyListeners()
        .notifyListeners()

      expect(spy).toHaveBeenCalledTimes(2)
    })
  })

  describe('actions', () => {
    it('should call action', () => {
      const spies = {increment: jasmine.createSpy('a.increment')}
      engine.addActions(ag.singleActionGroup(spies))
      engine.actions.increment()

      expect(spies.increment).toHaveBeenCalled()
    })

    it('should call multiple action', () => {
      const spies = {
        a: {increment: jasmine.createSpy('a.increment')},
        b: {increment: jasmine.createSpy('b.increment')}
      }
      engine.addActions(ag.multipleActionGroups(spies))
      engine.actions.increment()

      expect(spies.a.increment).toHaveBeenCalled()
      expect(spies.b.increment).toHaveBeenCalled()
    })

    it('should update store', () => {
      engine.addActions(ag.singleActionGroup())

      expect(engine.store.A).toEqual(0)
      engine.actions.increment()

      expect(engine.store.A).toEqual(1)
    })

    it('should update multiple stores', () => {
      engine.addActions(ag.multipleActionGroups())

      expect(engine.store.A).toEqual(0)
      expect(engine.store.B).toEqual(0)
      engine.actions.increment()

      expect(engine.store.A).toEqual(1)
      expect(engine.store.B).toEqual(1)
    })

    it('should trigger notifyListeners', () => {
      spyOn(engine, 'notifyListeners')

      engine.addActions(ag.singleActionGroup())
      engine.actions.increment()

      expect(engine.notifyListeners).toHaveBeenCalled()
    })

    it('should trigger notifyListeners with the action name and argument', () => {
      spyOn(engine, 'notifyListeners')

      engine.addActions(ag.argsActionGroup())
      engine.actions.increment(5)

      expect(engine.notifyListeners).toHaveBeenCalledWith('increment', 5)
    })

    it('should pass arguments into the action', () => {
      const argsSpy = jasmine.createSpy('args spy')

      const spies = {increment: argsSpy}
      engine.addActions(ag.argsActionGroup(spies))
      engine.actions.increment(10)

      expect(argsSpy).toHaveBeenCalledWith(0, 10, engine.actions)
    })

    it('should be chainable off of actons argument', () => {
      engine.addActions(ag.chainActionGroup())

      expect(engine.store.A).toEqual(0)
      engine.actions.chainIncrement()
      expect(engine.store.A > 0).toBeTruthy()
    })

    it('should call chain-action with updated state', () => {
      engine.addActions(ag.chainActionGroup())

      expect(engine.store.A).toEqual(0)
      engine.actions.chainIncrement()
      expect(engine.store.A).toEqual(2)
    })

    it('should call chain-action for all actionGroups', () => {
      engine.addActions(ag.multipleChainActionGroups())

      expect(engine.store.A).toEqual(0)
      engine.actions.chainIncrement()
      // chainIncrement here actually triggers increment twice
      // chainIncrement -> { A: 1, B: 1 }, queue: [a.increment, b.increment]
      // dequeue (a's) increment -> { A: 2, B: 2 }, queue: [b.increment]
      // dequeue (b's) increment -> { A: 3, B: 3 }, queue: []
      expect(engine.store.A).toEqual(3)
    })
  })

  describe('store', () => {
    it('should return the inital states before action calls', () => {
      engine.addActions(ag.singleActionGroup())

      expect(engine.store.A).toEqual(0)
    })

    it('should return updated states after action calls', () => {
      engine.addActions(ag.singleActionGroup())
      engine.actions.increment()

      expect(engine.store.A).toEqual(1)
    })

    it('should not update store for invalid action calls', () => {
      engine.addActions(ag.singleActionGroup())
      engine.actions.increment()

      // only way to attempt to call a non-existent
      // function and continue tests.
      try {
        engine.decrement()
      } catch (err) {
        expect(err).toEqual(jasmine.any(Error))
      }
      expect(engine.store.A).toBe(1)
    })
  })
})
