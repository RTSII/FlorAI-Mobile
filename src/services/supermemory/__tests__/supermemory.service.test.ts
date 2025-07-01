import { supermemoryService } from '../supermemory.service';
import { Memory } from '../types';

describe('SupermemoryService', () => {
  // Test user ID - in a real app, this would come from your auth system
  const TEST_USER_ID = 'test-user-123';
  let testMemory: Memory;

  // Skip tests if we don't have an API key
  const runTests = process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY ? it : it.skip;

  beforeAll(() => {
    if (!process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY) {
      console.warn(
        'No Supermemory API key found. Set NEXT_PUBLIC_SUPERMEMORY_API_KEY to run tests.',
      );
    }
  });

  runTests('should create a memory', async () => {
    const testContent = `Test memory at ${new Date().toISOString()}`;

    testMemory = await supermemoryService.createMemory({
      content: testContent,
      userId: TEST_USER_ID,
      metadata: {
        testRun: true,
        category: 'test',
      },
    });

    expect(testMemory).toBeDefined();
    expect(testMemory.id).toBeDefined();
    expect(testMemory.content).toBe(testContent);
    expect(testMemory.metadata?.userId).toBe(TEST_USER_ID);
  });

  runTests('should retrieve a memory', async () => {
    const memory = await supermemoryService.getMemory(testMemory.id!);
    expect(memory).toBeDefined();
    expect(memory.id).toBe(testMemory.id);
    expect(memory.content).toBe(testMemory.content);
  });

  runTests('should search memories', async () => {
    // First create a memory we can search for
    const searchContent = `Search test ${Math.random().toString(36).substring(7)}`;
    await supermemoryService.createMemory({
      content: searchContent,
      userId: TEST_USER_ID,
      metadata: { testRun: true },
    });

    // Search for it
    const results = await supermemoryService.searchMemories({
      query: searchContent.split(' ')[0], // Just use the first word
      userId: TEST_USER_ID,
      limit: 5,
    });

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.content.includes(searchContent))).toBe(true);
  });

  runTests('should update a memory', async () => {
    const updatedContent = `Updated at ${new Date().toISOString()}`;
    const updatedMemory = await supermemoryService.updateMemory(testMemory.id!, {
      content: updatedContent,
      metadata: {
        ...testMemory.metadata,
        updatedAt: new Date().toISOString(),
      },
    });

    expect(updatedMemory.content).toBe(updatedContent);
    expect(updatedMemory.metadata?.updatedAt).toBeDefined();
  });

  runTests('should delete a memory', async () => {
    await expect(supermemoryService.deleteMemory(testMemory.id!)).resolves.not.toThrow();

    // Verify it's gone
    try {
      await supermemoryService.getMemory(testMemory.id!);
      fail('Memory should have been deleted');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
