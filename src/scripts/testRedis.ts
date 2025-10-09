import cacheService from '../services/cacheService';

async function testRedisConnection() {
    console.log('Testing Redis connection...');
    
    try {
        // Test basic set/get operations
        const testKey = 'test:connection';
        const testValue = 'Redis is working!';
        
        console.log('Setting test value...');
        await cacheService.set(testKey, testValue, 30);
        
        console.log('Getting test value...');
        const retrieved = await cacheService.get(testKey);
        
        if (retrieved === testValue) {
            console.log('✅ Redis connection successful!');
            console.log('Retrieved value:', retrieved);
        } else {
            console.log('❌ Retrieved value does not match');
        }
        
        // Test TTL
        const ttl = await cacheService.getTTL(testKey);
        console.log('TTL for test key:', ttl, 'seconds');
        
        // Test key existence
        const exists = await cacheService.exists(testKey);
        console.log('Key exists:', exists);
        
        // Clean up
        await cacheService.del(testKey);
        console.log('Test key deleted');
        
        // Test after deletion
        const afterDelete = await cacheService.get(testKey);
        console.log('Value after deletion:', afterDelete);
        
    } catch (error) {
        console.error('❌ Redis connection failed:', error);
    }
}

// Run the test
testRedisConnection();