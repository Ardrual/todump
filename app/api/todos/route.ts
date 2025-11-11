import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

// GET all todos for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT id, text, completed, parent_id as "parentId", created_at as "createdAt", updated_at as "updatedAt"
       FROM todos
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ todos: result.rows });
  } catch (error) {
    console.error('Get todos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new todo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { text, parentId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO todos (user_id, text, parent_id)
       VALUES ($1, $2, $3)
       RETURNING id, text, completed, parent_id as "parentId", created_at as "createdAt", updated_at as "updatedAt"`,
      [session.user.id, text, parentId || null]
    );

    return NextResponse.json(
      { todo: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update a todo
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, text, completed } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [session.user.id, id];
    let paramCount = 2;

    if (text !== undefined) {
      paramCount++;
      updates.push(`text = $${paramCount}`);
      values.push(text);
    }

    if (completed !== undefined) {
      paramCount++;
      updates.push(`completed = $${paramCount}`);
      values.push(completed);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    const result = await query(
      `UPDATE todos
       SET ${updates.join(', ')}
       WHERE user_id = $1 AND id = $2
       RETURNING id, text, completed, parent_id as "parentId", created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ todo: result.rows[0] });
  } catch (error) {
    console.error('Update todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a todo
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    // Delete the todo and all its sub-tasks (CASCADE will handle this)
    const result = await query(
      'DELETE FROM todos WHERE user_id = $1 AND id = $2 RETURNING id',
      [session.user.id, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
