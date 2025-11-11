"use client";

import { Todo } from "@/types/todo";
import { useState } from "react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  isSubTask?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  isSubTask = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isSubTask
          ? "ml-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
      } ${todo.completed ? "opacity-60" : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 cursor-pointer"
      />

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm dark:bg-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 ${
              todo.completed ? "line-through text-gray-500" : "dark:text-white"
            }`}
          >
            {todo.text}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-gray-700"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
