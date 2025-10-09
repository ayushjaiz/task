import cacheService, { CACHE_KEYS } from './cacheService';
import { cacheConfig } from '../config';

// Task-specific cache operations
export class TaskCacheService {
    // Cache user's tasks
    static async cacheUserTasks(userId: any, tasks: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.TASKS, userId);
        const value = JSON.stringify(tasks);
        await cacheService.set(key, value, cacheConfig.tasksTTL);
    }

    // Get user's cached tasks
    static async getUserTasks(userId: any): Promise<any[] | null> {
        const key = cacheService.generateKey(CACHE_KEYS.TASKS, userId);
        const cached = await cacheService.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    // Cache individual task
    static async cacheTask(taskId: any, task: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.TASK, taskId);
        const value = JSON.stringify(task);
        await cacheService.set(key, value, cacheConfig.tasksTTL);
    }

    // Get cached task (includes subtasks)
    static async getTask(taskId: any): Promise<any | null> {
        const key = cacheService.generateKey(CACHE_KEYS.TASK, taskId);
        const cached = await cacheService.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    // Get cached task with explicit subtasks access
    static async getTaskWithSubtasks(taskId: any): Promise<{ task: any, subtasks: any } | null> {
        const task = await this.getTask(taskId);
        if (task) {
            return {
                task,
                subtasks: task.subtasks || []
            };
        }
        return null;
    }

    // Note: Subtasks are cached as part of the task object, no separate caching needed

    // Invalidate user's task cache
    static async invalidateUserTasks(userId: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.TASKS, userId);
        await cacheService.del(key);
    }

    // Invalidate specific task cache (includes subtasks since they're part of the task)
    static async invalidateTask(taskId: any): Promise<void> {
        const taskKey = cacheService.generateKey(CACHE_KEYS.TASK, taskId);
        await cacheService.del(taskKey);
    }

    // Invalidate all task-related cache for a user
    static async invalidateAllUserCache(userId: any): Promise<void> {
        const pattern = `${CACHE_KEYS.TASKS}:${userId}*`;
        const keys = await cacheService.getKeys(pattern);
        if (keys.length > 0) {
            await cacheService.delMultiple(keys);
        }
    }
}

// User-specific cache operations
export class UserCacheService {
    // Cache user data
    static async cacheUser(userId: any, user: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.USER, userId);
        const value = JSON.stringify(user);
        await cacheService.set(key, value, cacheConfig.userTTL);
    }

    // Get cached user
    static async getUser(userId: any): Promise<any | null> {
        const key = cacheService.generateKey(CACHE_KEYS.USER, userId);
        const cached = await cacheService.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    // Invalidate user cache
    static async invalidateUser(userId: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.USER, userId);
        await cacheService.del(key);
    }

    // Cache session data
    static async cacheSession(sessionId: any, sessionData: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.SESSION, sessionId);
        const value = JSON.stringify(sessionData);
        await cacheService.set(key, value, cacheConfig.userTTL);
    }

    // Get cached session
    static async getSession(sessionId: any): Promise<any | null> {
        const key = cacheService.generateKey(CACHE_KEYS.SESSION, sessionId);
        const cached = await cacheService.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    // Invalidate session
    static async invalidateSession(sessionId: any): Promise<void> {
        const key = cacheService.generateKey(CACHE_KEYS.SESSION, sessionId);
        await cacheService.del(key);
    }
}

const cacheUtilsExport = {
    TaskCacheService,
    UserCacheService,
    cacheService
};

export default cacheUtilsExport;