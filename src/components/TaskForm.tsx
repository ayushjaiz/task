"use client";

import { useState, useEffect } from 'react';
import { useCreateTask, useUpdateTask, Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface TaskFormProps {
    task?: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function TaskForm({ task, open, onOpenChange }: TaskFormProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState(task?.status || 'pending');
    const [error, setError] = useState('');

    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const isEditing = !!task;
    const loading = createTask.isPending || updateTask.isPending;

    // Update form state when task prop changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending');
        }
        setError('');
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !description.trim()) {
            setError('Title and description are required');
            return;
        }

        if (title.length > 100) {
            setError('Title cannot be more than 100 characters');
            return;
        }

        if (description.length > 500) {
            setError('Description cannot be more than 500 characters');
            return;
        }

        try {
            if (isEditing) {
                await updateTask.mutateAsync({
                    id: task._id,
                    title: title.trim(),
                    description: description.trim(),
                    status,
                });
            } else {
                await createTask.mutateAsync({
                    title: title.trim(),
                    description: description.trim(),
                });
            }

            // Reset form
            setTitle('');
            setDescription('');
            setStatus('pending');
            setError('');
            onOpenChange(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save task');
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset form when closing
            setTitle(task?.title || '');
            setDescription(task?.description || '');
            setStatus(task?.status || 'pending');
            setError('');
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update your task details.' : 'Add a new task to your list.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={100}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {title.length}/100
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={500}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {description.length}/500
                            </div>
                        </div>
                        {isEditing && (
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={(value: "pending" | "done") => setStatus(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-600 text-sm">{error}</div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
