import redisClient from "../config/redisConfig";
import { cacheConfig } from "../config";

const get = async (key: string): Promise<string | null> => {
    try {
        const value = await redisClient.get(key);
        return value;
    } catch (error) {
        console.error('Error getting data from Redis', error);
        return null;
    }
}

const set = async (key: string, value: string, ttl: number = cacheConfig.defaultTTL): Promise<void> => {
    try {
        await redisClient.setEx(key, ttl, value);
        console.log(`Set key: ${key} in cache with TTL: ${ttl}s`);
    } catch (error) {
        console.error('Error setting data in Redis', error);
    }
}

// Function to set data without expiration
const setPersistent = async (key: string, value: string): Promise<void> => {
    try {
        await redisClient.set(key, value);
        console.log(`Set persistent key: ${key} in cache`);
    } catch (error) {
        console.error('Error setting persistent data in Redis', error);
    }
}

// Function to delete a cached value
const del = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
        console.log(`Deleted key: ${key} from cache`);
    } catch (error) {
        console.error('Error deleting data from Redis', error);
    }
};

// Function to delete multiple keys
const delMultiple = async (keys: string[]): Promise<void> => {
    try {
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Deleted keys: ${keys.join(', ')} from cache`);
        }
    } catch (error) {
        console.error('Error deleting multiple keys from Redis', error);
    }
};

// Function to check if a key exists
const exists = async (key: string): Promise<boolean> => {
    try {
        const result = await redisClient.exists(key);
        return result === 1;
    } catch (error) {
        console.error('Error checking key existence in Redis', error);
        return false;
    }
};

// Function to get TTL of a key
const getTTL = async (key: string): Promise<number> => {
    try {
        return await redisClient.ttl(key);
    } catch (error) {
        console.error('Error getting TTL from Redis', error);
        return -1;
    }
};

// Function to get all keys matching a pattern
const getKeys = async (pattern: string): Promise<string[]> => {
    try {
        return await redisClient.keys(pattern);
    } catch (error) {
        console.error('Error getting keys from Redis', error);
        return [];
    }
};

// Function to clear all cache (use with caution)
const flush = async (): Promise<void> => {
    try {
        await redisClient.flushAll();
        console.log('Cleared all cache');
    } catch (error) {
        console.error('Error flushing Redis cache', error);
    }
};

// Utility function to generate cache keys
const generateKey = (prefix: string, identifier: string): string => {
    return `${prefix}:${identifier}`;
};

// Common cache key prefixes
export const CACHE_KEYS = {
    USER: 'user',
    TASKS: 'tasks',
    TASK: 'task', // This includes subtasks as part of the task object
    SESSION: 'session',
};

// Export the functions so they can be used in other parts of the app
const cacheServiceExport = { 
    get, 
    set, 
    setPersistent,
    del, 
    delMultiple,
    exists, 
    getTTL, 
    getKeys, 
    flush, 
    generateKey 
};

export default cacheServiceExport;