/**
 * API Client
 * Core HTTP client for making API requests with error handling, retry logic, and response parsing
 */

import { API_BASE_URL, TIMEOUTS, MAX_RETRIES } from './config.ts';
import { ApiResponse, ApiError, ApiErrorCode, ApiRequestOptions } from './types.ts';

// In a real React Native app, we would use NetInfo
// For now, we'll mock it for development
const NetInfo = {
  fetch: () => Promise.resolve({ isConnected: true, isInternetReachable: true })
};

// Type for network connectivity check result
type NetworkInfoResult = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
};

// Default request options
const DEFAULT_OPTIONS: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include', // Include cookies for auth if applicable
};

// Active request AbortControllers for cancellation support
const activeRequests = new Map<string, AbortController>();

/**
 * Generate a unique request ID for tracking and cancellation
 */
const generateRequestId = (endpoint: string): string => {
  return `${endpoint}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if the device is currently online
 * @returns Promise resolving to boolean indicating online status
 */
const isOnline = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch() as NetworkInfoResult;
  return netInfo.isConnected === true && netInfo.isInternetReachable !== false;
};

/**
 * Handles API errors and converts them to a standardized format
 */
const handleApiError = async (response: Response): Promise<ApiError> => {
  try {
    const errorData = await response.json();
    return {
      code: errorData.code as ApiErrorCode || `HTTP_${response.status}` as ApiErrorCode,
      message: errorData.message || response.statusText || 'Unknown error occurred',
      details: errorData.details || null,
      status: response.status,
      timestamp: new Date().toISOString(),
    };
  } catch (_error) {
    return {
      code: `HTTP_${response.status}` as ApiErrorCode,
      message: response.statusText || 'Unknown error occurred',
      status: response.status,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Creates a timeout promise that rejects after the specified time
 * Prefixed with underscore as it's used internally
const _createTimeoutPromise = (timeoutMs: number, requestId: string): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        code: 'TIMEOUT' as ApiErrorCode,
        message: `Request timed out after ${timeoutMs}ms`,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }, timeoutMs);
  });
};

/**
 * Determines if a request should be retried based on the error and retry count
 */
const shouldRetry = (error: ApiError, retryCount: number): boolean => {
  // Don't retry if we've reached the maximum retry count
  if (retryCount >= MAX_RETRIES) return false;
  
  // Retry network errors, timeouts, and certain HTTP status codes
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') return true;
  
  // Retry server errors (5xx) but not client errors (4xx)
  if (error.status && error.status >= 500 && error.status < 600) return true;
  
  // Don't retry other errors
  return false;
};

/**
 * Calculate exponential backoff delay for retries
 * @param retryCount Current retry attempt (0-based)
 * @returns Delay in milliseconds
 */
const getRetryDelay = (retryCount: number): number => {
  // Exponential backoff with jitter: 2^retryCount * 100ms + random jitter
  const baseDelay = Math.pow(2, retryCount) * 100;
  const jitter = Math.random() * 100;
  return baseDelay + jitter;
};

/**
 * Fetch with timeout and retry logic
 */
const fetchWithTimeout = async <T>(
  url: string,
  options: RequestInit = {},
  apiOptions: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    timeoutMs = TIMEOUTS.DEFAULT,
    _retries = MAX_RETRIES, // Prefixed with underscore as it's not directly used
    requestId = generateRequestId(url),
    abortPrevious = true,
  } = apiOptions;

  // Check if we're online before making the request
  const online = await isOnline();
  if (!online) {
    throw {
      code: ApiErrorCode.NETWORK_ERROR,
      message: 'No internet connection available',
      timestamp: new Date().toISOString(),
    } as ApiError;
  }

  // Create abort controller for this request
  const controller = new AbortController();
  const signal = controller.signal;

  // If we should abort previous requests to the same endpoint
  if (abortPrevious) {
    const endpoint = new URL(url).pathname;
    const previousController = activeRequests.get(endpoint);
    if (previousController) {
      previousController.abort();
    }
    activeRequests.set(endpoint, controller);
  }

  // Add the abort signal to the options
  const fetchOptions = {
    ...options,
    signal,
  };

  // Create a timeout promise that rejects after the specified time
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject({
        code: ApiErrorCode.TIMEOUT,
        message: `Request timed out after ${timeoutMs}ms`,
        timestamp: new Date().toISOString(),
      } as ApiError);
    }, timeoutMs);
  });

  // Function to perform the fetch with retry logic
  // Prefixed with underscore as it's used internally
  const _performFetchWithRetry = async (retriesLeft: number): Promise<ApiResponse<T>> => {
    try {
      // Race between the fetch and the timeout
      const response = await Promise.race([
        fetch(url, fetchOptions),
        timeoutPromise,
      ]) as Response;

      // Clean up the active request tracking
      if (abortPrevious) {
        const endpoint = new URL(url).pathname;
        activeRequests.delete(endpoint);
      }

      // Handle non-2xx responses
      if (!response.ok) {
        const error = await handleApiError(response);

        // Check if we should retry based on status code
        if (retriesLeft > 0 && shouldRetry(error, MAX_RETRIES - retriesLeft)) {
          // Calculate backoff with jitter
          const backoff = getRetryDelay(MAX_RETRIES - retriesLeft);
          await new Promise(resolve => setTimeout(resolve, backoff));
          return _performFetchWithRetry(retriesLeft - 1);
        }

        throw error;
      }
      
      // Parse successful response
      const data = await response.json();
      
      // Return standardized API response
      return {
        data,
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          retryCount: MAX_RETRIES - retriesLeft,
          endpoint: new URL(url).pathname,
        },
      };
    } catch (error: unknown) {
      // Handle abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: {
            code: ApiErrorCode.ABORTED,
            message: 'Request was aborted',
            timestamp: new Date().toISOString(),
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
            retryCount: MAX_RETRIES - retriesLeft,
            endpoint: url,
          },
        };
      }
      
      // Create standardized error object
      const apiError: ApiError = {
        code: ApiErrorCode.NETWORK_ERROR,
        message: error instanceof Error ? error.message : 'A network error occurred',
        timestamp: new Date().toISOString(),
      };
      
      // Check if we should retry
      if (retriesLeft > 0 && shouldRetry(apiError, MAX_RETRIES - retriesLeft)) {
        const delay = getRetryDelay(MAX_RETRIES - retriesLeft);
        await new Promise(resolve => setTimeout(resolve, delay));
        return _performFetchWithRetry(retriesLeft - 1);
      }
      
      // Clean up the controller from the active requests map
      activeRequests.delete(requestId);
      
      // Return error response
      return {
        error: apiError,
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          retryCount: MAX_RETRIES - retriesLeft,
          endpoint: url,
        },
      };
    }
  }
  
  // Start the fetch with the maximum number of retries
  return _performFetchWithRetry(MAX_RETRIES);
}

/**
 * API Client with methods for different HTTP verbs
 */
export const apiClient = {
  /**
   * Make a GET request
   */
  get: <T>(
    endpoint: string,
    params: Record<string, unknown> = {},
    options: RequestInit = {},
    timeoutMs: number = TIMEOUTS.DEFAULT
  ): Promise<ApiResponse<T>> => {
    // Build URL with query parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    // Merge default options with provided options
    const mergedOptions: RequestInit = {
      ...DEFAULT_OPTIONS,
      ...options,
      method: 'GET',
    };

    // Create API request options
    const apiOptions: ApiRequestOptions = {
      timeoutMs,
      requestId: generateRequestId(endpoint),
    };

    return fetchWithTimeout<T>(url.toString(), mergedOptions, apiOptions);
  },

  /**
   * Make a POST request
   */
  post: <T>(
    endpoint: string,
    data: Record<string, unknown> = {},
    options: RequestInit = {},
    timeoutMs: number = TIMEOUTS.DEFAULT
  ): Promise<ApiResponse<T>> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default options with provided options
    const mergedOptions: RequestInit = {
      ...DEFAULT_OPTIONS,
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    };

    // Create API request options
    const apiOptions: ApiRequestOptions = {
      timeoutMs,
      requestId: generateRequestId(endpoint),
    };

    return fetchWithTimeout<T>(url.toString(), mergedOptions, apiOptions);
  },

  /**
   * Make a PUT request
   */
  put: <T>(
    endpoint: string,
    data: Record<string, unknown> = {},
    options: RequestInit = {},
    timeoutMs: number = TIMEOUTS.DEFAULT
  ): Promise<ApiResponse<T>> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default options with provided options
    const mergedOptions: RequestInit = {
      ...DEFAULT_OPTIONS,
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    };

    // Create API request options
    const apiOptions: ApiRequestOptions = {
      timeoutMs,
      requestId: generateRequestId(endpoint),
    };

    return fetchWithTimeout<T>(url.toString(), mergedOptions, apiOptions);
  },

  /**
   * Make a PATCH request
   */
  patch: <T>(
    endpoint: string,
    data: Record<string, unknown> = {},
    options: RequestInit = {},
    timeoutMs: number = TIMEOUTS.DEFAULT
  ): Promise<ApiResponse<T>> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default options with provided options
    const mergedOptions: RequestInit = {
      ...DEFAULT_OPTIONS,
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    };

    // Create API request options
    const apiOptions: ApiRequestOptions = {
      timeoutMs,
      requestId: generateRequestId(endpoint),
    };

    return fetchWithTimeout<T>(url.toString(), mergedOptions, apiOptions);
  },

  /**
   * Make a DELETE request
   */
  delete: <T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = TIMEOUTS.DEFAULT
  ): Promise<ApiResponse<T>> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default options with provided options
    const mergedOptions: RequestInit = {
      ...DEFAULT_OPTIONS,
      ...options,
      method: 'DELETE',
    };

    // Create API request options
    const apiOptions: ApiRequestOptions = {
      timeoutMs,
      requestId: generateRequestId(endpoint),
    };

    return fetchWithTimeout<T>(url.toString(), mergedOptions, apiOptions);
  },
};
