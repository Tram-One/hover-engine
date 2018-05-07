# Hover-Engine
<a href="https://www.npmjs.com/package/hover-engine"><img src="https://img.shields.io/npm/dm/hover-engine.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/hover-engine"><img src="https://img.shields.io/npm/v/hover-engine.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/hover-engine"><img src="https://img.shields.io/npm/l/hover-engine.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/hover-engine"><img src="https://github.com/Tram-One/hover-engine/raw/master/docs/images/esm-size.svg?sanitize=true" alt="ESM build size"></a>
<a href="http://unpkg.com/hover-engine"><img src="https://github.com/Tram-One/hover-engine/raw/master/docs/images/umd-size.svg?sanitize=true" alt="UMD build size"></a>
<a href="https://join.slack.com/t/tram-one/shared_invite/enQtMjY0NDA3OTg2MzQyLWUyMGIyZTYwNzZkNDJiNWNmNzdiOTMzYjg0YzMzZTkzZDE4MTlmN2Q2YjE0NDIwMGI3ODEzYzQ4ODdlMzQ2ODM"><img src="https://img.shields.io/badge/slack-join-83ded3.svg?style=flat" alt="Join Slack"></a>

A state-management library that runs on predictable magic.

## You've got to have POWER!
Hover-Engine is inspired by
[minidux](https://github.com/freeman-lab/minidux),
[hover](https://github.com/jesseskinner/hover),
and [hyperapp](https://github.com/hyperapp/hyperapp)
so if you're familar with those frameworks, you'll notice some similarities!

Hover-Engine gives your app the following super-powers:
* Trigger multiple sets of actions with a single dispatch!
* Notify as many listeners as you want!
* Handle async (or chained) action calls with predictable results!
* No Dependencies!
* Light enough to give you flight (~2 KB)!

## Install
You can install hover-engine with npm like any other package.
```bash
npm install --save hover-engine
```

You can also include the umd distributable in your webpage directly with a
script tag.
```html
<head>
  <script src="http://unpkg.com/hover-engine" />
</head>
```

## Usage
```javascript
const HoverEngine = require('hover-engine')

const counterActions = {
  init: () => 0,
  increment: (state) => state + 1
}

const engine = new HoverEngine()
engine.addActions({ counter: counterActions })
engine.addListener((store) => console.log('NEW STATE:', store))

engine.actions.increment() // -> NEW STATE: { counter: 1 }
engine.actions.increment() // -> NEW STATE: { counter: 2 }
engine.store.counter // -> 2
```

## API
### `constructor()`
The constructor builds a new HoverEngine object. It takes in no parameters, and is immediately available for calling actions and store on (although they will be empty until you add actions).

Usage:
```javascript
const engine = new HoverEngine()
```

### `addActions(actionGroups)`
The `addActions` function adds new actions to the HoverEngine. It takes in a single object, whose keys will be used to get at the store, and whose values is an object mapping action names to functions.

Example actionGroup:
```javascript
const actionGroup = {
  counter: {
    init: () => 0,
    increment: (counter) => counter + 1,
    decrement: (counter) => counter - 1
  }
}
```
In this example, `counter` is the key which you can use on the `engine.store`. The actions: `init`, `increment`, and `decrement`, are functions which will be called in `engine.actions`
```javascript
const engine = new HoverEngine()
engine.addActions(actionGroup)  // adds the counter action group
engine.actions.increment()      // calls our increment function for counter
engine.store.counter            // returns the value at counter (in this case, 1)
```

#### The `init` action
```javascript
const actionGroup = {
  counter: {
    init: () => 0
  }
}
```
All groups of actions **must** include the `init` action. This action dictates the initial state of the store value for those actions. In the above example, you'll notice that we set the initial value to 0. It is common to use zero, empty array, or empty string as inital values, but it is also a good place for default values.

The `init` action is called after `engine.addActions` runs. It is passed no arguments.

#### Action Arguments
```javascript
const temperatureActions = {
  init: () => 70,

  increaseTemp: (temp) => temp + 1,

  setTemperature: (temp, newTemp) => newTemp,

  pullTemperatureFromZipcode: (temp, zipCode, actions) => {
    fetch('some.temperature.api/' + zipCode)
      .then((tempData) => actions.setTemperature(tempData))
  }
}
```
Excluding the `init` action, all actions are provided with the following arguments:
 - current state of the store (for this group of actions)
 - value passed into the action call
 - actions from the Hover-Engine

The first argument allows you to build a new state off of the existing one. In the example above, we `increaseTemp` from the value currently in the store.
```javascript
const engine = new HoverEngine()
engine.addActions({temp: temperatureActions})
engine.actions.increaseTemp()
console.log(engine.store) // -> { temp: 71 }
```

The second argument is anything that we pass in when we call the action. For example:
```javascript
const engine = new HoverEngine()
engine.addActions({temp: temperatureActions})
engine.actions.setTemperature(-10)
console.log(engine.store) // -> { temp: -10 }
```

In this example, we would set temperature `-10` to the current value in the store.

The third argument is a reference to all available actions in Hover-Engine. These actions can be called and then are added to an existing queue of actions that get fired off one at a time to update the store.
```javascript
const engine = new HoverEngine()
engine.addActions({temp: temperatureActions})
engine.actions.pullTemperatureFromZipcode('14623')
console.log(engine.store) // -> { temp: 76 }
```

This can be useful for async actions such as fetching, or when you need to call an action as a result of another action.

#### Adding Multiple Action Groups
With Hover-Engine, you can add multiple action groups two different ways. One way is by calling `addActions` multiple times. The other way, is by providing multiple sets of actions in the object you pass in, as shown below.

```javascript
const todoActions = {
  todo: {
    init: () => [],
    addTodo: (todos, newTodo) => todos.concat(newTodo)
  },
  input: {
    init: () => '',
    setInput: (input, newInput) => newInput,
    addTodo: () => ''
  }
}
const engine = new HoverEngine()
engine.addActions(todoActions)    // adds the todo and input action groups
const newTodo = 'Buy Milk'
engine.actions.setInput(newTodo)  // store -> { todo: [], input: 'Buy Milk' }
engine.actions.addTodo(newTodo)   // store -> { todo: ['Buy Milk'], input: '' }
```

You'll notice in the above example that calling `addTodo` actually called both todo's `addTodo` and input's `addTodo`. We'll go over this more in the **engine.actions** section below.

### `addListener(listener)`

Listeners in Hover-Engine are functions that get called whenever an action is called. It receives the updated `engine.store`, `engine.actions`, as well as information about the action that was called (read below).

```javascript
const commentThreadActions = {
  init: () => [],
  addComment: (thread, newComment) => thread.concat(newComment)
}

const engine = new HoverEngine()
engine.addActions({thread: commentThreadActions})

engine.addListener((store) => document.body.innerHTML = store.thread.join('<br />'))
```

Like `addActions`, you can add as many listeners as you want by calling `addListener` multiple times. Each will be called with the new store.

#### Listener Arguments
Along with the store and actions, listeners also recieve the name of the action that was called, and the argument it was called with. With these, you can use listeners to debug what is happening in hover-engine. In the example below, we log the action and the new values in the store.

```javascript
const debugListener = (store, actions, actionName, actionArguments) => {
  console.log(actionName, actionArguments, '->', store)
}
```

### `notifyListeners(actionName, actionArguments)`

`notifyListeners` is a function which tells all the listeners to be triggered. It takes in an action name and action argument (both of which are optional), and calls all the listeners that have been added with the current store and actions, and passes along the action name and argument if they were included. You shouldn't need this in most applications, but can be useful for testing or debugging your logic.

```javascript
const counterActions = {
  init: () => 0,
  increment: (counter) => counter + 1
}

const engine = new HoverEngine()
engine.addListener((store) => console.log('store:', store))
engine.notifyListeners() // store: {counter: 0}
```

Like `addActions`, you can add as many listeners as you want by calling `addListener` multiple times. Each will be called with the new store.

### `engine.actions`

As shown above in the various examples above, `engine.actions` provides a means to call any actions that were added via `addActions` off of engine. In addition, `actions` is automatically a composition of all same-named actions.

```javascript
const TimeZoneActions = {
  init: () => {status: 'NOT_LOADED', timezone: null},
  setTimezone: (state, newTimezone) => {status: 'LOADED', timezone: newTimezone},
  getTimezoneFromZipCode: (state, zipCode, actions) => {
    fetch('some.timezone.api/' + zipCode).then(
      (timezoneData) => {
        actions.setTimezone(timezone)
      }
    )
  },
  updateZipCode: (state, zipCode, actions) => {
    actions.getTimezoneFromZipCode(zipCode)
  }
}

const WeatherActions = {
  init: () => {status: 'NOT_LOADED', weather: null},
  setWeather: (state, newWeather) => {status: 'LOADED', weather: newWeather},
  getWeatherFromZipCode: (state, zipCode, actions) => {
    fetch('some.weather.api/' + zipCode).then(
      (weatherData) => actions.setWeather(weather)
    )
  },
  updateZipCode: (state, zipCode, actions) => {
    actions.getWeatherFromZipCode(zipCode)
  }
}

const engine = new HoverEngine()
engine.addActions({
  timezone: TimeZoneActions,
  weather: WeatherActions
})

engine.actions.updateZipCode('14623')
```

In the example above, same-named actions like `updateZipCode` will fire off for both the `WeatherActions` and the `TimeZoneActions`. It queues up `weather.updateZipCode` and `timezone.updateZipCode`. As both of those resolve, any actions that are triggered (like `getWeatherFromZipCode` and `setWeather`) will also get added to the queue in order, and each will take in an updated version of the state.

### `engine.store`

The engine store exposes the current state of all the action groups. When you `addActions` the keys of the action object are the accessors for store values.
