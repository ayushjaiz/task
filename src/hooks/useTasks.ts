import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubtaskType } from '@/models/Task';

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'done';
    userId: string;
    subtasks: SubtaskType[];
    createdAt: string;
    updatedAt: string;
}

export interface TasksResponse {
    tasks: Task[];
    pagination: {
        current: number;
        total: number;
        count: number;
        limit: number;
    };
}

export interface TaskFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

// Fetch tasks
export const useTasks = (filters: TaskFilters = {}) => {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: async (): Promise<TasksResponse> => {
            const params = new URLSearchParams();
            if (filters.page) params.set('page', filters.page.toString());
            if (filters.limit) params.set('limit', filters.limit.toString());
            if (filters.search) params.set('search', filters.search);
            if (filters.status) params.set('status', filters.status);

            const response = await fetch(`/api/tasks?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        },
    });
};

// Create task
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (task: { title: string; description: string; status?: string }) => {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create task');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

// Update task
export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...task }: { id: string; title: string; description: string; status: string }) => {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update task');
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate all task-related queries to ensure fresh data including subtasks
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            // Also remove any specific task queries that might be cached
            queryClient.removeQueries({ queryKey: ['task'] });
        },
    });
};

// Delete task
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete task');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};
