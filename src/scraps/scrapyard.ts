interface TodoItem {
  id: number,
  title: string,
  status: string,
  completedOn?: Date
}

enum TodoStatus {
  DONE = "done",
  IN_PROGRESS = "in-progress",
  TODO = "todo"
}

const todoItems: TodoItem[] = [
  { id: 1, title: "Learn HTML", status: "done", completedOn: new Date("2021-09-11") },
  { id: 2, title: "Learn TypeScript", status: "in-progress" },
  { id: 3, title: "Write the best app in the world", status: "todo" },
]

function addTodoItem(todo: string): TodoItem {
  const id = getNextId(todoItems);

  const newTodo: TodoItem = {
      id,
      title: todo,
      status: "todo",
  }

  todoItems.push(newTodo)

  return newTodo
}

function getNextId<T extends { id: number }>(items: T[]): number {
  return items.reduce((max, x) => x.id > max ? x.id : max, 0) + 1;
}

const newTodo = addTodoItem("Buy lots of stuff with all the money we make from the app")

console.log(JSON.stringify(newTodo))