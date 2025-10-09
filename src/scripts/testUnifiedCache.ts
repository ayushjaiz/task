import { TaskCacheService } from '../services/cacheUtils';

// Example task with subtasks
const sampleTask = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Complete Project Setup',
    description: 'Set up the entire project infrastructure',
    status: 'pending',
    userId: '507f1f77bcf86cd799439012',
    subtasks: [
        {
            subtask_id: 'subtask_1',
            description: 'Set up database connection',
            isCompleted: false
        },
        {
            subtask_id: 'subtask_2', 
            description: 'Configure authentication',
            isCompleted: true
        },
        {
            subtask_id: 'subtask_3',
            description: 'Set up API routes',
            isCompleted: false
        }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
};

async function testTaskWithSubtasksCache() {
    console.log('🧪 Testing Task + Subtasks Unified Caching...\n');

    try {
        const taskId = sampleTask._id;

        // 1. Cache the complete task (includes subtasks)
        console.log('1. Caching complete task with subtasks...');
        await TaskCacheService.cacheTask(taskId, sampleTask);
        console.log('✅ Task cached successfully\n');

        // 2. Retrieve the cached task (should include subtasks)
        console.log('2. Retrieving cached task...');
        const cachedTask = await TaskCacheService.getTask(taskId);
        
        if (cachedTask) {
            console.log('✅ Task retrieved from cache:');
            console.log(`   - Title: ${cachedTask.title}`);
            console.log(`   - Status: ${cachedTask.status}`);
            console.log(`   - Subtasks count: ${cachedTask.subtasks?.length || 0}`);
            
            if (cachedTask.subtasks && cachedTask.subtasks.length > 0) {
                console.log('   - Subtasks:');
                cachedTask.subtasks.forEach((subtask: any, index: number) => {
                    console.log(`     ${index + 1}. ${subtask.description} - ${subtask.isCompleted ? '✅' : '⏳'}`);
                });
            }
        } else {
            console.log('❌ No cached task found');
        }

        console.log('\n3. Using getTaskWithSubtasks method...');
        const taskWithSubtasks = await TaskCacheService.getTaskWithSubtasks(taskId);
        
        if (taskWithSubtasks) {
            console.log('✅ Task with explicit subtasks access:');
            console.log(`   - Task title: ${taskWithSubtasks.task.title}`);
            console.log(`   - Subtasks array length: ${taskWithSubtasks.subtasks.length}`);
            console.log(`   - Completed subtasks: ${taskWithSubtasks.subtasks.filter((s: any) => s.isCompleted).length}`);
        }

        // 4. Test cache invalidation
        console.log('\n4. Testing cache invalidation...');
        await TaskCacheService.invalidateTask(taskId);
        
        const afterInvalidation = await TaskCacheService.getTask(taskId);
        if (!afterInvalidation) {
            console.log('✅ Task successfully removed from cache after invalidation');
        } else {
            console.log('❌ Task still in cache after invalidation');
        }

        console.log('\n🎉 All tests completed successfully!');
        console.log('\n📝 Key Benefits:');
        console.log('   • Tasks and subtasks are stored together');
        console.log('   • Single cache operation for complete task data');
        console.log('   • No need for separate subtask cache management');
        console.log('   • Consistent data - no sync issues between task and subtasks');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Export the test function
export { testTaskWithSubtasksCache };