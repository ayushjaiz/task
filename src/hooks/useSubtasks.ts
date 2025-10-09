"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateSubtaskRequest {
    taskId: string;
    subtaskId: string;
    isCompleted: boolean;
}

export const useUpdateSubtask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, subtaskId, isCompleted }: UpdateSubtaskRequest) => {
            const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subtaskId, isCompleted }),
            });

            if (!response.ok) {
                throw new Error('Failed to update subtask');
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch tasks
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            console.error('Error updating subtask:', error);
        },
    });
};