import { TaskCacheService, UserCacheService } from '../services/cacheUtils';
import Task from '../models/Task';
import User from '../models/User';

export class CacheWarmupService {
    /**
     * Warm up cache for a specific user's most recent tasks
     */
    static async warmupUserTasks(userId: string, limit: number = 10): Promise<void> {
        try {
            console.log(`Warming up cache for user: ${userId}`);
            
            // Get recent tasks from database
            const tasks = await Task.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            
            // Cache each task individually (includes subtasks as part of task object)
            for (const task of tasks) {
                await TaskCacheService.cacheTask(task._id.toString(), task);
            }
            
            // Cache the task list
            const response = {
                tasks,
                pagination: {
                    current: 1,
                    total: Math.ceil(tasks.length / limit),
                    count: tasks.length,
                    limit
                }
            };
            
            await TaskCacheService.cacheUserTasks(userId, response);
            
            console.log(`Cache warmed up for ${tasks.length} tasks`);
        } catch (error) {
            console.error('Error warming up user tasks cache:', error);
        }
    }
    
    /**
     * Warm up cache for user data
     */
    static async warmupUserData(userId: string): Promise<void> {
        try {
            console.log(`Warming up user data cache for: ${userId}`);
            
            const user = await User.findById(userId).lean();
            if (user) {
                await UserCacheService.cacheUser(userId, user);
                console.log('User data cache warmed up');
            }
        } catch (error) {
            console.error('Error warming up user data cache:', error);
        }
    }
    
    /**
     * Warm up cache for multiple users (useful for popular users or after system restart)
     */
    static async warmupMultipleUsers(userIds: string[]): Promise<void> {
        console.log(`Warming up cache for ${userIds.length} users`);
        
        const promises = userIds.map(async (userId) => {
            await Promise.all([
                this.warmupUserData(userId),
                this.warmupUserTasks(userId)
            ]);
        });
        
        await Promise.allSettled(promises);
        console.log('Bulk cache warmup completed');
    }
    
    /**
     * Warm up cache for most active users
     */
    static async warmupActiveUsers(limit: number = 50): Promise<void> {
        try {
            console.log(`Warming up cache for ${limit} most active users`);
            
            // Get users with most tasks (most active)
            const activeUsers = await Task.aggregate([
                {
                    $group: {
                        _id: '$userId',
                        taskCount: { $sum: 1 },
                        lastActivity: { $max: '$createdAt' }
                    }
                },
                {
                    $sort: { taskCount: -1, lastActivity: -1 }
                },
                {
                    $limit: limit
                }
            ]);
            
            const userIds = activeUsers.map(user => user._id.toString());
            await this.warmupMultipleUsers(userIds);
            
            console.log(`Cache warmed up for ${userIds.length} active users`);
        } catch (error) {
            console.error('Error warming up active users cache:', error);
        }
    }
    
    /**
     * Schedule periodic cache warmup
     */
    static scheduleWarmup(): NodeJS.Timeout {
        console.log('Scheduling periodic cache warmup every 30 minutes');
        
        return setInterval(async () => {
            console.log('Running scheduled cache warmup...');
            await this.warmupActiveUsers(25); // Warm up top 25 active users
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Cache warming utility for development/testing
export const warmupCache = async () => {
    console.log('Starting cache warmup process...');
    
    try {
        await CacheWarmupService.warmupActiveUsers(10);
        console.log('✅ Cache warmup completed successfully');
    } catch (error) {
        console.error('❌ Cache warmup failed:', error);
    }
};