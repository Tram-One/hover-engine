class HoverEngine {
  constructor() {
    this.engine = {}
    this.store = {}
    this.actionQueue = []
    this.subscriptions = []

    const engineHandler = {
      get: (target, name) => {
        return (args) => {
          const shouldRunQueue = this.actionQueue.length === 0
          this.actionQueue.push({actions: this.engine[name], args: args})

          if (shouldRunQueue) {
            while (this.actionQueue.length > 0) {
              const nextAction = this.actionQueue[0]
              this.store = nextAction.actions.reduce((store, action) => {
                return Object.assign({}, store,
                  {[action._storeKey]: action(store[action._storeKey], nextAction.args, this.actions)}
                )
              }, this.store)
              this.actionQueue.shift()
              this.notifyListeners()
            }
          }
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
        return Object.values(actionGroups[actionKey])
          .map((action) => {
            action._storeKey = actionKey
            return action
          })
      }
    }

    this.engine = Object.keys(actionGroups)
      .map(getAddKeyToActionFunc(actionGroups))
      .reduce(addActionGroupToEngine, this.engine)

    const addActionObjectToStore = (store, actionObject) => {
      return Object.assign({}, store, {[actionObject.key]: actionObject.init()})
    }

    this.store = Object.keys(actionGroups)
      .map((actionGroupKey) => Object({
        key: actionGroupKey,
        init: actionGroups[actionGroupKey].init
      }))
      .reduce(addActionObjectToStore, this.store)

    return this
  }

  addListener(listener) {
    this.subscriptions.push(listener)

    return this
  }

  notifyListeners() {
    this.subscriptions.forEach(listener => listener(this.store, this.actions))
  }

}

module.exports = HoverEngine
