export interface Memory {
  id?: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemorySearchResult {
  id: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface CreateMemoryParams {
  content: string;
  metadata?: Record<string, any>;
  userId: string;
}

export interface SearchMemoriesParams {
  query: string;
  userId: string;
  limit?: number;
  threshold?: number;
}
