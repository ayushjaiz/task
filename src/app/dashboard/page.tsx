"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks, Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import { Plus, Search, LogOut, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { data: tasksData, isLoading, error } = useTasks({
        page,
        search,
        status: status === 'all' ? '' : status,
        limit: 10,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setTaskFormOpen(true);
    };

    const handleCloseTaskForm = () => {
        setTaskFormOpen(false);
        setEditingTask(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to first page when searching
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setPage(1); // Reset to first page when filtering
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                            <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search tasks..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="outline">
                                    Search
                                </Button>
                            </form>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tasks</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => setTaskFormOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Task
                        </Button>
                    </div>
                </div>

                {/* Tasks */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-red-600">
                                Failed to load tasks. Please try again.
                            </p>
                        </CardContent>
                    </Card>
                ) : !tasksData?.tasks.length ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>No tasks found</CardTitle>
                            <CardDescription>
                                {search || status !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by creating your first task!'}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <>
                        {/* Task Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tasksData.tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {tasksData.pagination.total > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="px-4 py-2 text-sm text-gray-700">
                                    Page {tasksData.pagination.current} of {tasksData.pagination.total}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === tasksData.pagination.total}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Task Form Dialog */}
            <TaskForm
                task={editingTask}
                open={taskFormOpen}
                onOpenChange={handleCloseTaskForm}
            />
        </div>
    );
}
