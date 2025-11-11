# todump

A todo app for people who are bad at todo apps.

An AI-enhanced todo application that helps you break down vague tasks into concrete, actionable steps using the Gemini API.

## Features

- ✨ **AI-Powered Task Breakdown**: Turn vague ideas into concrete steps using Gemini AI
- ✅ **Complete Task Management**: Add, edit, delete, and mark todos as complete
- 🌲 **Hierarchical Tasks**: AI-generated sub-tasks are organized under parent tasks
- 🎨 **Clean UI**: Modern, responsive design with dark mode support
- 🔐 **User Authentication**: Secure login and registration with NextAuth.js
- 💾 **PostgreSQL Database**: Your todos persist in a PostgreSQL database
- 👤 **Multi-User Support**: Each user has their own private todos

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database**:
   ```bash
   # Create a new database
   createdb todump

   # Or using psql
   psql -U postgres
   CREATE DATABASE todump;
   ```

3. **Configure environment variables**:
   - Copy `.env.local.example` to `.env.local`
   - Update the following variables:
     ```env
     # Gemini API key from https://makersuite.google.com/app/apikey
     GEMINI_API_KEY=your_gemini_api_key_here

     # PostgreSQL connection string
     DATABASE_URL=postgresql://postgres:password@localhost:5432/todump

     # NextAuth secret (generate with: openssl rand -base64 32)
     NEXTAUTH_SECRET=your_nextauth_secret_here
     NEXTAUTH_URL=http://localhost:3000
     ```

4. **Initialize the database**:
   ```bash
   npm run init-db
   ```

   Or manually run the migrations:
   ```bash
   psql -U postgres -d todump -f db/migrations/001_init.sql
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

7. **Create an account**:
   - Click "Register" to create a new account
   - Sign in with your credentials
   - Start managing your todos!

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
- **Database**: PostgreSQL with pg driver
- **Authentication**: NextAuth.js v5 with credentials provider
- **Password Hashing**: bcryptjs

## License

MIT
