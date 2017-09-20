# Hover-Engine

A state-management library that runs on technology and magic.

```
┌───────────────────────────────────────────────┐
│                                               │
│   Bundle size: 1.84 KB, Gzipped size: 757 B   │
│                                               │
└───────────────────────────────────────────────┘
```

## You've got to have POWER!
Hover-Engine is inspired by
[minidux](https://github.com/freeman-lab/minidux),
[hover](https://github.com/jesseskinner/hover),
and [hyperapp](https://github.com/hyperapp/hyperapp)
so if you're familar with those frameworks, you'll notice some similarities!

Hover-Engine gives your app the following super-powers:
* Trigger multiple sets of actions with a single dispatch!
* Notify as many listeners as you want!
* Handle async (or chained) action calls with [semi-predictable results](https://en.wikipedia.org/wiki/Magic_\(illusion\))!
* No Dependencies!
* Light enough to give you flight (less than 2 KB)!

## Install
```bash
npm install --save hover-engine
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

#### Action Arguements
```javascript
const calculatorActions = {
  init: () => 0,
  add: (storedValue, number) => storedValue + number,
  subtract: (storedValue, number) => storedValue - number,
}
```
Excluding from the `init` action, all actions are provided with the following arguments:
 - current state of the store (for this group of actions)
 - value passed into the action call
 - actions from the Hover-Engine

The first argument allows you to build a new state off of the existing one. In the example above, we `add` or `subtract` from the value currently in the store.

The second arguement is anything that we pass in when we call the action. For example:
```javascript
const engine = new HoverEngine()
engine.addActions({calc: calculatorActions})
engine.actions.add(10)
```
In this example, we would add `10` to the current value in the store.

The last argument

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

### engine.actions
