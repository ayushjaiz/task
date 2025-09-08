import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { requireAuth } from '@/lib/middleware';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const userId = requireAuth(request);
        const { id: taskId } = await params;

        const task = await Task.findOne({ _id: taskId, userId });

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        if (error instanceof Error && error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const userId = requireAuth(request);
        const { id: taskId } = await params;
        const { title, description, status } = await request.json();

        // Validate input
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        if (title.length > 100) {
            return NextResponse.json(
                { error: 'Title cannot be more than 100 characters' },
                { status: 400 }
            );
        }

        if (description.length > 500) {
            return NextResponse.json(
                { error: 'Description cannot be more than 500 characters' },
                { status: 400 }
            );
        }

        if (status && !['pending', 'done'].includes(status)) {
            return NextResponse.json(
                { error: 'Status must be either pending or done' },
                { status: 400 }
            );
        }

        // Update task
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { title, description, status, updatedAt: new Date() },
            { new: true }
        );

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        if (error instanceof Error && error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const userId = requireAuth(request);
        const { id: taskId } = await params;

        const task = await Task.findOneAndDelete({ _id: taskId, userId });

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        if (error instanceof Error && error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
