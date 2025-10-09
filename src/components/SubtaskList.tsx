"use client";

import { useState } from 'react';
// Using simple text symbols instead of icons
import SubtaskItem from './SubtaskItem';
import { SubtaskType } from '@/models/Task';

interface SubtaskListProps {
    taskId: string;
    subtasks: SubtaskType[];
    onSubtaskToggle: (subtaskId: string, isCompleted: boolean) => void;
}

export default function SubtaskList({ taskId, subtasks, onSubtaskToggle }: SubtaskListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!subtasks || subtasks.length === 0) {
        return null;
    }

    const completedCount = subtasks.filter(subtask => subtask.isCompleted).length;
    const totalCount = subtasks.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="mt-4 border-t pt-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left hover:bg-gray-50 rounded-md p-2 transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-sm">
                        {isExpanded ? '▼' : '▶'}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                        Subtasks ({completedCount}/{totalCount})
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">
                        {Math.round(progressPercentage)}%
                    </span>
                </div>
            </button>

            {isExpanded && (
                <div className="mt-2 space-y-1">
                    {subtasks.map((subtask) => (
                        <SubtaskItem
                            key={subtask.subtask_id}
                            subtask={subtask}
                            onToggle={onSubtaskToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}