export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  parentId?: string; // For AI-generated sub-tasks
}

export interface TodoInput {
  text: string;
}
