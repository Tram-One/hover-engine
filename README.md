# Hover-Engine

A state-management library that runs on technology and magic.

```
┌───────────────────────────────────────────────┐
│                                               │
│   Bundle size: 1.82 KB, Gzipped size: 755 B   │
│                                               │
└───────────────────────────────────────────────┘
```

## You've got to have POWER!
Hover-Engine is inspired by
[redux](https://github.com/reactjs/redux),
[hover](https://github.com/jesseskinner/hover),
and [hyperapp](https://github.com/hyperapp/hyperapp)
so if you're familar with those frameworks, you'll notice some similarities!

Hover-Engine gives your app the following super-powers:
* Trigger multiple sets of actions with a single dispatch!
* Subscribe to as many listeners that are willing to hear you!
* Handle async (or chained) action calls with [semi-predictable results](https://en.wikipedia.org/wiki/Magic_\(illusion\))!
* No Dependencies!
* Light enough to give you flight (1.82 KB)!

## Install
```bash
npm install --save hover-engine
```

## Usage
```javascript
const HoverEngine = require('hover-engine')

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
engine.store // -> { num: 8 }
```
