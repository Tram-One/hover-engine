const HoverEngine = require('../hover-engine')

const TodoActions = {
  init: () => [],
  addTodo: (state, text) => [text].concat(state),
  completeTodo: (state, removeText) => state.filter(todoText => todoText !== removeText)
}

const DonesActions = {
  init: () => [],
  completeTodo: (state, doneText) => [doneText].concat(state)
}

const engine = new HoverEngine()
engine.addActions({todos: TodoActions})
engine.addActions({dones: DonesActions})

engine.addListener((store) => console.log('store:', store))
engine.actions.addTodo('Write More Todos')
engine.actions.addTodo('Finish docs')
engine.actions.completeTodo('Write More Todos')
