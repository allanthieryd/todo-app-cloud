export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

// In-memory store (resets on server restart)
const todos = new Map<string, Todo>();

export function getAllTodos(): Todo[] {
  return Array.from(todos.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.set(todo.id, todo);
  return todo;
}

export function getTodo(id: string): Todo | undefined {
  return todos.get(id);
}

export function updateTodo(id: string, patch: Partial<Pick<Todo, "title" | "done">>): Todo | null {
  const todo = todos.get(id);
  if (!todo) return null;
  const updated = { ...todo, ...patch };
  todos.set(id, updated);
  return updated;
}

export function deleteTodo(id: string): boolean {
  return todos.delete(id);
}
