import { useState, useCallback } from 'react';
import {
  Memory,
  MemorySearchResult,
  CreateMemoryParams,
  SearchMemoriesParams,
} from '../services/supermemory';
import { supermemoryService } from '../services/supermemory/supermemory.service';

export const useSupermemory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMemory = useCallback(
    async (params: Omit<CreateMemoryParams, 'userId'>, userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const memory = await supermemoryService.createMemory({
          ...params,
          userId,
        });
        return memory;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create memory'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const searchMemories = useCallback(
    async (
      query: string,
      userId: string,
      options: Omit<SearchMemoriesParams, 'query' | 'userId'> = {},
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await supermemoryService.searchMemories({
          query,
          userId,
          ...options,
        });
        return results;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to search memories'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getMemory = useCallback(async (memoryId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const memory = await supermemoryService.getMemory(memoryId);
      return memory;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get memory'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMemory = useCallback(async (memoryId: string, updates: Partial<Memory>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedMemory = await supermemoryService.updateMemory(memoryId, updates);
      return updatedMemory;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update memory'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMemory = useCallback(async (memoryId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await supermemoryService.deleteMemory(memoryId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete memory'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createMemory,
    getMemory,
    searchMemories,
    updateMemory,
    deleteMemory,
    isLoading,
    error,
  };
};
