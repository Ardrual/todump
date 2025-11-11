"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { storage } from "@/lib/storage";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTodos(storage.getTodos());
  }, []);

  const handleAddTodo = async (text: string, useAI: boolean) => {
    if (useAI) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/breakdown", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI breakdown");
        }

        const { steps } = await response.json();

        // Create parent todo
        const parentTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        // Create sub-todos
        const subTodos: Todo[] = steps.map((step: string) => ({
          id: crypto.randomUUID(),
          text: step,
          completed: false,
          createdAt: new Date().toISOString(),
          parentId: parentTodo.id,
        }));

        const newTodos = storage.addTodos([parentTodo, ...subTodos]);
        setTodos(newTodos);
      } catch (error) {
        console.error("Error getting AI breakdown:", error);
        alert("Failed to get AI breakdown. Adding as regular todo.");
        // Fallback to regular todo
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        const newTodos = storage.addTodo(newTodo);
        setTodos(newTodos);
      } finally {
        setIsLoading(false);
      }
    } else {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const newTodos = storage.addTodo(newTodo);
      setTodos(newTodos);
    }
  };

  const handleToggleTodo = (id: string) => {
    const newTodos = storage.updateTodo(id, {
      completed: !todos.find((t) => t.id === id)?.completed,
    });
    setTodos(newTodos);
  };

  const handleDeleteTodo = (id: string) => {
    const newTodos = storage.deleteTodo(id);
    setTodos(newTodos);
  };

  const handleUpdateTodo = (id: string, text: string) => {
    const newTodos = storage.updateTodo(id, { text });
    setTodos(newTodos);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const completedCount = todos.filter((t) => t.completed && !t.parentId).length;
  const totalCount = todos.filter((t) => !t.parentId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            todump
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A todo app for people who are bad at todo apps
          </p>
          {totalCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <TodoInput onAdd={handleAddTodo} isLoading={isLoading} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        </div>

        <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            💡 Tip: Use &quot;AI Breakdown&quot; to turn vague tasks into concrete steps
          </p>
        </footer>
      </div>
    </div>
  );
}
