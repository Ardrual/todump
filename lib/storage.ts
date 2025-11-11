import { Todo } from "@/types/todo";

const STORAGE_KEY = "todump_todos";

export const storage = {
  getTodos: (): Todo[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveTodos: (todos: Todo[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },

  addTodo: (todo: Todo): Todo[] => {
    const todos = storage.getTodos();
    const newTodos = [...todos, todo];
    storage.saveTodos(newTodos);
    return newTodos;
  },

  addTodos: (newTodos: Todo[]): Todo[] => {
    const todos = storage.getTodos();
    const allTodos = [...todos, ...newTodos];
    storage.saveTodos(allTodos);
    return allTodos;
  },

  updateTodo: (id: string, updates: Partial<Todo>): Todo[] => {
    const todos = storage.getTodos();
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    storage.saveTodos(newTodos);
    return newTodos;
  },

  deleteTodo: (id: string): Todo[] => {
    const todos = storage.getTodos();
    // Also delete any sub-tasks
    const newTodos = todos.filter(
      (todo) => todo.id !== id && todo.parentId !== id
    );
    storage.saveTodos(newTodos);
    return newTodos;
  },
};
