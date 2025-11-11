# todump

A todo app for people who are bad at todo apps.

An AI-enhanced todo application that helps you break down vague tasks into concrete, actionable steps using the Gemini API.

## Features

- ✨ **AI-Powered Task Breakdown**: Turn vague ideas into concrete steps using Gemini AI
- ✅ **Complete Task Management**: Add, edit, delete, and mark todos as complete
- 🌲 **Hierarchical Tasks**: AI-generated sub-tasks are organized under parent tasks
- 🎨 **Clean UI**: Modern, responsive design with dark mode support
- 💾 **Local Storage**: Your todos persist in your browser

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up your Gemini API key**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Usage

### Adding a Regular Todo
1. Type your task in the input field
2. Click "Add Todo"

### Using AI Breakdown
1. Type a task or goal (can be vague like "plan a birthday party" or "learn React")
2. Click "✨ AI Breakdown"
3. The AI will break it down into 2-5 concrete, actionable steps
4. All steps will be added as sub-tasks under your main task

### Managing Todos
- **Complete**: Check the checkbox to mark a todo as done
- **Edit**: Click "Edit" to modify the todo text
- **Delete**: Click "Delete" to remove the todo (also removes sub-tasks)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Storage**: Browser LocalStorage

## License

MIT
