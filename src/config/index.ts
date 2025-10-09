export const redisConfig = {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
};

export const cacheConfig = {
    defaultTTL: 3600, // 1 hour in seconds
    tasksTTL: 1800,   // 30 minutes for tasks
    userTTL: 7200,    // 2 hours for user data
};