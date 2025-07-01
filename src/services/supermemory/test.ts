// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Log environment variables for debugging
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_SUPERMEMORY_API_URL:', process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL);
console.log(
  'NEXT_PUBLIC_SUPERMEMORY_API_KEY:',
  process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY
    ? `${process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY.substring(0, 10)}...`
    : 'Not set',
);

const { supermemoryService } = require('.');

async function testSupermemory() {
  const userId = 'test-user-123';
  const testContent = 'This is a test memory from FlorAI-Mobile integration test';
  let testMemoryId: string | null = null;

  try {
    // Test 1: Create Memory
    console.log('\n--- Test 1: Creating test memory ---');
    const memory = await supermemoryService.createMemory({
      userId,
      content: testContent,
      metadata: {
        type: 'test',
        source: 'FlorAI-Mobile Integration Test',
        timestamp: new Date().toISOString(),
      },
    });

    testMemoryId = memory.id;
    console.log('✅ Memory created successfully. ID:', testMemoryId);

    // Test 2: Get Memory
    console.log('\n--- Test 2: Retrieving memory ---');
    const retrievedMemory = await supermemoryService.getMemory(testMemoryId);
    console.log('✅ Memory retrieved successfully:', {
      id: retrievedMemory.id,
      content: retrievedMemory.content,
      userId: retrievedMemory.metadata.userId,
      type: retrievedMemory.metadata.type,
    });

    // Test 3: Search Memories
    console.log('\n--- Test 3: Searching memories ---');
    const searchResults = await supermemoryService.searchMemories({
      query: 'test memory',
      userId,
    });

    console.log(`✅ Found ${searchResults.length} matching memories`);
    if (searchResults.length > 0) {
      console.log('First result:', {
        id: searchResults[0].id,
        score: searchResults[0].score,
        content: searchResults[0].content.substring(0, 50) + '...',
      });
    }

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  } finally {
    // Cleanup: Delete test memory if it was created
    if (testMemoryId) {
      try {
        console.log('\n--- Cleanup: Deleting test memory ---');
        await supermemoryService.deleteMemory(testMemoryId);
        console.log('✅ Test memory deleted successfully');
      } catch (cleanupError) {
        console.error('❌ Failed to clean up test memory:', cleanupError);
      }
    }
    process.exit(0);
  }
}

// Run the test
console.log('Starting Supermemory integration tests...');
testSupermemory();
