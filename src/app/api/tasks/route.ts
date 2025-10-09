import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import { requireAuth } from '@/lib/middleware';
import { geminiService } from '@/services/geminiService';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = requireAuth(request);
        const { searchParams } = new URL(request.url);

        // Get query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        // Build query
        interface TaskQuery {
            userId: string;
            $or?: Array<{ title?: { $regex: string; $options: string } } | { description?: { $regex: string; $options: string } }>;
            status?: string;
        }

        const query: TaskQuery = { userId };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get tasks and total count
        const [tasks, total] = await Promise.all([
            Task.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Task.countDocuments(query)
        ]);

        return NextResponse.json({
            tasks,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                count: total,
                limit
            }
        });
    } catch (error) {
        console.error('Get tasks error:', error);
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

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const userId = requireAuth(request);
        const { title, description, status = 'pending' } = await request.json();

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

        // Generate subtasks using Gemini AI
        const subtasks = await geminiService.generateSubtasks(title, description);

        // Create task with generated subtasks
        const task = await Task.create({
            title,
            description,
            status,
            userId,
            subtasks
        });

        return NextResponse.json(
            {
                message: 'Task created successfully',
                task
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create task error:', error);
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
