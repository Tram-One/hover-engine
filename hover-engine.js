class HoverEngine {
  constructor() {
    this.engine = {}
    this.store = {}
    this.actionQueue = []
    this.listeners = []

    const updateStoreByNextAction = (nextAction) => (store, action) => {
      return Object.assign({}, store,
        {[action._storeKey]: action(store[action._storeKey], nextAction.args, this.actions)}
      )
    }

    const engineHandler = {
      get: (target, name) => (args) => {
        const shouldRunQueue = this.actionQueue.length === 0
        this.actionQueue.push({actions: this.engine[name], args: args})

        // eslint-disable-next-line no-unmodified-loop-condition
        while (shouldRunQueue && this.actionQueue.length > 0) {
          const nextAction = this.actionQueue[0]
          const updateStoreByAction = updateStoreByNextAction(nextAction)
          this.store = (nextAction.actions || []).reduce(updateStoreByAction, this.store)
          this.actionQueue.shift()
          this.notifyListeners()
        }
      }
    }

    this.actions = new Proxy({}, engineHandler)
  }

  addActions(actionGroups) {
    const addActionToEngine = (actions, action) => {
      const newActions = (action.name in actions) ?
        actions[action.name].concat(action) :
        [action]
      return Object.assign({}, actions, {[action.name]: newActions})
    }

    const addActionGroupToEngine = (actions, group) => {
      return Object.values(group)
        .reduce(addActionToEngine, actions)
    }

    const getAddKeyToActionFunc = (actionGroups) => {
      return (actionKey) => {
        const addStoreKeyToAction = (action) => {
          action._storeKey = actionKey
          return action
        }
        return Object.values(actionGroups[actionKey])
          .map(addStoreKeyToAction)
      }
    }

    this.engine = Object.keys(actionGroups)
      .map(getAddKeyToActionFunc(actionGroups))
      .reduce(addActionGroupToEngine, this.engine)

    const addInitObjectToStore = (store, initObject) => {
      return Object.assign({}, store, {[initObject.key]: initObject.init()})
    }

    const actionGroupToInitObject = (actionGroupKey) => Object({
      key: actionGroupKey,
      init: actionGroups[actionGroupKey].init
    })

    this.store = Object.keys(actionGroups)
      .map(actionGroupToInitObject)
      .reduce(addInitObjectToStore, this.store)

    return this
  }

  addListener(listener) {
    this.listeners.push(listener)

    return this
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.store, this.actions))

    return this
  }

}

module.exports = HoverEngine
