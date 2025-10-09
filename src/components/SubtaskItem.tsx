"use client";

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { SubtaskType } from '@/models/Task';

interface SubtaskItemProps {
    subtask: SubtaskType;
    onToggle: (subtaskId: string, isCompleted: boolean) => void;
}

export default function SubtaskItem({ subtask, onToggle }: SubtaskItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggle = async () => {
        setIsUpdating(true);
        try {
            await onToggle(subtask.subtask_id, !subtask.isCompleted);
        } catch (error) {
            console.error('Error updating subtask:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex items-start space-x-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
            <Checkbox
                id={subtask.subtask_id}
                checked={subtask.isCompleted}
                onCheckedChange={handleToggle}
                disabled={isUpdating}
                className="mt-0.5"
            />
            <label
                htmlFor={subtask.subtask_id}
                className={`text-sm flex-1 cursor-pointer transition-all ${
                    subtask.isCompleted
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900'
                } ${isUpdating ? 'opacity-50' : ''}`}
            >
                {subtask.description}
            </label>
        </div>
    );
}