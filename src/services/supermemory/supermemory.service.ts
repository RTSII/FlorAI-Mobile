// src/services/supermemory/supermemory.service.ts
import { Memory, MemorySearchResult, CreateMemoryParams, SearchMemoriesParams } from './types';

const SUPERMEMORY_API_URL =
  process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL || 'https://api.supermemory.ai';
const SUPERMEMORY_API_PATH = '/v3';

export class SupermemoryService {
  private apiKey: string;
  private baseUrl: string;

  constructor(
    apiKey: string = process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY || '',
    baseUrl: string = SUPERMEMORY_API_URL,
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${SUPERMEMORY_API_PATH}${endpoint}`;

    console.log('Making request to:', url);

    if (!this.apiKey) {
      throw new Error(
        'SuperMemory API key is not configured. Please set NEXT_PUBLIC_SUPERMEMORY_API_KEY in your .env file',
      );
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${this.apiKey}`);
    headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return responseData;
    } catch (error) {
      console.error('Supermemory API error:', error);
      throw error;
    }
  }

  async createMemory(params: CreateMemoryParams): Promise<Memory> {
    return this.request<Memory>('/memories', {
      method: 'POST',
      body: JSON.stringify({
        content: params.content,
        containerTags: ['florai-app', `user:${params.userId}`],
        metadata: {
          ...params.metadata,
          source: 'florai-mobile-app',
          userId: params.userId,
        },
      }),
    });
  }

  async getMemory(memoryId: string): Promise<Memory> {
    return this.request<Memory>(`/memories/${memoryId}`);
  }

  async searchMemories(params: SearchMemoriesParams): Promise<MemorySearchResult[]> {
    const { query, userId, limit = 5, threshold = 0.7 } = params;

    return this.request<{ results: MemorySearchResult[] }>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        containerTags: [`user:${userId}`],
        limit,
        min_score: threshold,
      }),
    }).then((response) => response.results || []);
  }

  async updateMemory(memoryId: string, updates: Partial<Memory>): Promise<Memory> {
    return this.request<Memory>(`/memories/${memoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteMemory(memoryId: string): Promise<void> {
    await this.request(`/memories/${memoryId}`, {
      method: 'DELETE',
    });
  }
}

// Singleton instance
export const supermemoryService = new SupermemoryService();
