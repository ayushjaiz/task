"use client";

import { useState } from 'react';
import { Task, useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const deleteTask = useDeleteTask();

    const handleDelete = async () => {
        try {
            await deleteTask.mutateAsync(task._id);
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {task.title}
                        </CardTitle>
                        <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
                            {task.status === 'done' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                                <Clock className="w-3 h-3 mr-1" />
                            )}
                            {task.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Created {formatDate(task.createdAt)}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(task)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteTask.isPending}
                        >
                            {deleteTask.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
