"use client";

import { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onUpdate,
}: TodoListProps) {
  // Group todos by parent
  const parentTodos = todos.filter((todo) => !todo.parentId);
  const childTodosByParent = todos.reduce((acc, todo) => {
    if (todo.parentId) {
      if (!acc[todo.parentId]) {
        acc[todo.parentId] = [];
      }
      acc[todo.parentId].push(todo);
    }
    return acc;
  }, {} as Record<string, Todo[]>);

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No todos yet!</p>
        <p className="text-sm mt-2">
          Add a task above or use AI Breakdown for intelligent task planning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {parentTodos.map((todo) => (
        <div key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
          {childTodosByParent[todo.id] && (
            <div className="mt-2 space-y-2">
              {childTodosByParent[todo.id].map((childTodo) => (
                <TodoItem
                  key={childTodo.id}
                  todo={childTodo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  isSubTask
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
