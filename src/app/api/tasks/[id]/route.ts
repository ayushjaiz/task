import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { requireAuth } from '@/lib/middleware';
import { TaskCacheService } from '@/services/cacheUtils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const userId = requireAuth(request);
        const { id: taskId } = await params;

        // Try to get from cache first (includes subtasks)
        const cachedTask = await TaskCacheService.getTask(taskId);
        if (cachedTask && cachedTask.userId === userId) {
            console.log('Returning cached task with subtasks:', taskId);
            return NextResponse.json({ task: cachedTask });
        }

        // If not in cache, get from database
        const task = await Task.findOne({ _id: taskId, userId });

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        // Cache the task for future requests (includes subtasks)
        await TaskCacheService.cacheTask(taskId, task);

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

        // Get the current task to check if title or description changed
        const currentTask = await Task.findOne({ _id: taskId, userId });
        
        if (!currentTask) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        // Check if title or description changed (which would require regenerating subtasks)
        const titleChanged = currentTask.title !== title;
        const descriptionChanged = currentTask.description !== description;
        const shouldRegenerateSubtasks = titleChanged || descriptionChanged;

        let updateData: any = { title, description, status, updatedAt: new Date() };

        // If title or description changed, regenerate subtasks
        if (shouldRegenerateSubtasks) {
            try {
                const { geminiService } = await import('@/services/geminiService');
                const subtasks = await geminiService.generateSubtasks(title, description);
                updateData.subtasks = subtasks;
            } catch (subtaskError) {
                console.error('Failed to regenerate subtasks:', subtaskError);
                // Continue with the update even if subtask generation fails
                // Keep the existing subtasks
            }
        }

        // Update task
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            updateData,
            { new: true }
        );

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        // Update cache with new task data
        await TaskCacheService.cacheTask(taskId, task);
        
        // Invalidate user's tasks cache since task was updated
        await TaskCacheService.invalidateUserTasks(userId);

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

        // Remove task from cache
        await TaskCacheService.invalidateTask(taskId);
        
        // Invalidate user's tasks cache since task was deleted
        await TaskCacheService.invalidateUserTasks(userId);

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
