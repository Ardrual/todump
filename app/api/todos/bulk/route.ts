import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

// POST create multiple todos at once (for AI breakdown)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { todos } = await request.json();

    if (!Array.isArray(todos) || todos.length === 0) {
      return NextResponse.json(
        { error: 'Todos array is required' },
        { status: 400 }
      );
    }

    // Validate all todos have text
    if (todos.some(t => !t.text)) {
      return NextResponse.json(
        { error: 'All todos must have text' },
        { status: 400 }
      );
    }

    // Build bulk insert query
    const values: any[] = [];
    const placeholders: string[] = [];

    todos.forEach((todo, index) => {
      const offset = index * 3;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
      values.push(session.user.id, todo.text, todo.parentId || null);
    });

    const result = await query(
      `INSERT INTO todos (user_id, text, parent_id)
       VALUES ${placeholders.join(', ')}
       RETURNING id, text, completed, parent_id as "parentId", created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    return NextResponse.json(
      { todos: result.rows },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bulk create todos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
