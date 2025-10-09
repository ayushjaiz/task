import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { requireAuth } from '@/lib/middleware';
import { TaskCacheService } from '@/services/cacheUtils';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const userId = requireAuth(request);
        const { subtaskId, isCompleted } = await request.json();

        if (!subtaskId || typeof isCompleted !== 'boolean') {
            return NextResponse.json(
                { error: 'Subtask ID and completion status are required' },
                { status: 400 }
            );
        }

        const { id } = await params;

        // Find the task and update the specific subtask
        const task = await Task.findOneAndUpdate(
            { 
                _id: id, 
                userId,
                'subtasks.subtask_id': subtaskId 
            },
            { 
                $set: { 
                    'subtasks.$.isCompleted': isCompleted,
                    updatedAt: new Date()
                } 
            },
            { new: true }
        );

        if (!task) {
            return NextResponse.json(
                { error: 'Task or subtask not found' },
                { status: 404 }
            );
        }

        // Update cache with modified task (includes updated subtasks)
        await TaskCacheService.cacheTask(id, task);
        
        // Invalidate user's tasks cache since subtask was updated
        await TaskCacheService.invalidateUserTasks(userId);

        return NextResponse.json({
            message: 'Subtask updated successfully',
            task
        });

    } catch (error) {
        console.error('Update subtask error:', error);
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