"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Todo } from "@/types/todo";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch todos on mount
  useEffect(() => {
    if (status === "authenticated") {
      setMounted(true);
      fetchTodos();
    }
  }, [status]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos || []);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = async (text: string, useAI: boolean) => {
    if (useAI) {
      setIsLoading(true);
      try {
        // Get AI breakdown
        const breakdownResponse = await fetch("/api/breakdown", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!breakdownResponse.ok) {
          throw new Error("Failed to get AI breakdown");
        }

        const { steps } = await breakdownResponse.json();

        // Create parent todo first
        const parentResponse = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!parentResponse.ok) {
          throw new Error("Failed to create parent todo");
        }

        const { todo: parentTodo } = await parentResponse.json();

        // Create sub-todos in bulk
        const todosToCreate = steps.map((step: string) => ({
          text: step,
          parentId: parentTodo.id,
        }));

        const bulkResponse = await fetch("/api/todos/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todos: todosToCreate }),
        });

        if (bulkResponse.ok) {
          // Refresh todos from server
          await fetchTodos();
        }
      } catch (error) {
        console.error("Error getting AI breakdown:", error);
        alert("Failed to get AI breakdown. Adding as regular todo.");
        // Fallback to regular todo
        try {
          const response = await fetch("/api/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
          });
          if (response.ok) {
            await fetchTodos();
          }
        } catch (err) {
          console.error("Error creating fallback todo:", err);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (response.ok) {
          await fetchTodos();
        }
      } catch (error) {
        console.error("Error creating todo:", error);
        alert("Failed to create todo");
      }
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, completed: !todo.completed }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      alert("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo");
    }
  };

  const handleUpdateTodo = async (id: string, text: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, text }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo");
    }
  };

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  const completedCount = todos.filter((t) => t.completed && !t.parentId).length;
  const totalCount = todos.filter((t) => !t.parentId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

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
