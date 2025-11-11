"use client";

import { useState } from "react";

interface TodoInputProps {
  onAdd: (text: string, useAI: boolean) => void;
  isLoading?: boolean;
}

export default function TodoInput({ onAdd, isLoading }: TodoInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent, useAI: boolean = false) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim(), useAI);
      setInput("");
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="mb-8">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you need to do?"
          disabled={isLoading}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Todo
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading || !input.trim()}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "AI Breaking Down..." : "✨ AI Breakdown"}
          </button>
        </div>
      </div>
    </form>
  );
}
