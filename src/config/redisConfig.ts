import { createClient } from 'redis';
import { redisConfig } from './index';

const redisClient = createClient({
    url: redisConfig.url
});

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('ready', () => {
    console.log('Redis client ready to use');
});

// Connect to Redis
const connectToRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log('Connected to Redis successfully');
        }
    } catch (error) {
        console.error('Could not connect to Redis', error);
    }
};

// Graceful shutdown
const disconnectFromRedis = async () => {
    try {
        if (redisClient.isOpen) {
            await redisClient.disconnect();
            console.log('Disconnected from Redis');
        }
    } catch (error) {
        console.error('Error disconnecting from Redis', error);
    }
};

// Initialize connection
connectToRedis();

// Handle process termination
process.on('SIGINT', async () => {
    await disconnectFromRedis();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectFromRedis();
    process.exit(0);
});

export default redisClient;