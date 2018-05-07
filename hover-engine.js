const values = (object) => Object.keys(object).map(key => object[key])
const flatMap = (allItems, items) => allItems.concat(items)

class HoverEngine {
  constructor() {
    this.engine = {}
    this.store = {}
    this.actionQueue = []
    this.listeners = []
    this.actions = {}
  }

  /**
   * addActions
   * - adds action groups to the engine
   * @param {Object} actionGroups
   * - keys in the action group object can be used to access stores
   * - values in the action group object are functions to mutate those stores
   */
  addActions(actionGroups) {
    const addActionToEngine = (actions, action) => {
      const newActions = (action.name in actions) ?
        actions[action.name].concat(action) :
        [action]
      return Object.assign({}, actions, {[action.name]: newActions})
    }

    const addActionGroupToEngine = (actions, group) => {
      return values(group).reduce(addActionToEngine, actions)
    }

    const getAddKeyToActionFunc = (actionGroups) => {
      return (actionKey) => {
        const addStoreKeyToAction = (action) => {
          action._storeKey = actionKey
          return action
        }
        return values(actionGroups[actionKey]).map(addStoreKeyToAction)
      }
    }

    this.engine = Object.keys(actionGroups)
      .map(getAddKeyToActionFunc(actionGroups))
      .reduce(addActionGroupToEngine, this.engine)

    const addInitObjectToStore = (store, initObject) => {
      return Object.assign({}, store, {[initObject.key]: initObject.init()})
    }

    const actionGroupToInitObject = (actionGroupKey) => ({
      key: actionGroupKey,
      init: actionGroups[actionGroupKey].init
    })

    this.store = Object.keys(actionGroups)
      .map(actionGroupToInitObject)
      .reduce(addInitObjectToStore, this.store)

    const callActions = (name, args) => {
      const updateStoreByNextAction = (nextAction) => (store, action) => {
        return Object.assign({}, store,
          {[action._storeKey]: action(store[action._storeKey], nextAction.args, this.actions)}
        )
      }

      const shouldRunQueue = this.actionQueue.length === 0
      this.actionQueue.push({actions: this.engine[name], args: args})

      // eslint-disable-next-line no-unmodified-loop-condition
      while (shouldRunQueue && this.actionQueue.length > 0) {
        const nextAction = this.actionQueue[0]
        const updateStoreByAction = updateStoreByNextAction(nextAction)
        this.store = nextAction.actions.reduce(updateStoreByAction, this.store)
        this.actionQueue.shift()
        this.notifyListeners(name, args)
      }
    }

    const addActionNameToActions = (actionsObject, actionName) => {
      return Object.assign({}, actionsObject, {[actionName]: (args) => callActions(actionName, args)})
    }

    this.actions = values(actionGroups)
      .map(group => Object.keys(group))
      .reduce(flatMap, [])
      .reduce(addActionNameToActions, this.actions)

    return this
  }

  /**
   * addListener
   * - function that takes in a function to call when an action occurs
   * @param {Function} listener function that can take in a store, actions to
   * call, actionName of what was called, and any arguments passed in
   */
  addListener(listener) {
    this.listeners.push(listener)

    return this
  }

  /**
   * notifyListeners
   * - used internally to call each listener that has been added with addListners
   * - doesn't actually trigger the action
   * @param {*} actionName - name of action triggered
   * @param {*} actionArguments - arguements passed into action when called
   */
  notifyListeners(actionName, actionArguments) {
    this.listeners.forEach(listener => listener(this.store, this.actions, actionName, actionArguments))

    return this
  }

}

module.exports = HoverEngine
