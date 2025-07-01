/**
 * Plant Data API Hook
 * Combines plant data API with state management
 */

import { useState } from 'react';
import { useAppContext } from '../store/AppContext.tsx';
import { 
  getPlantDetails,
  getPlantCareDetails,
  searchPlants
} from '../api/services/plantDataService.ts';
import { 
  PlantDetails, 
  PlantCareDetails,
  PlantSearchRequest,
  PlantSearchResponse
} from '../api/types.ts';

/**
 * Hook for plant data operations
 */
export const useApiPlantData = () => {
  const { dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantDetails, setPlantDetails] = useState<PlantDetails | null>(null);
  const [careDetails, setCareDetails] = useState<PlantCareDetails | null>(null);
  const [searchResults, setSearchResults] = useState<PlantSearchResponse | null>(null);

  /**
   * Fetch plant details by ID
   */
  const fetchPlantDetails = async (plantId: string, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await getPlantDetails(plantId, forceRefresh);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        setPlantDetails(response.data);
        return response.data;
      }
      
      return null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      // Error handling already done above
      setError(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Fetch plant care details by ID
   */
  const fetchPlantCareDetails = async (plantId: string, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await getPlantCareDetails(plantId, forceRefresh);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        setCareDetails(response.data);
        return response.data;
      }
      
      return null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      // Error handling already done above
      setError(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Search for plants
   */
  const searchForPlants = async (request: PlantSearchRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await searchPlants(request);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        setSearchResults(response.data);
        return response.data;
      }
      
      return null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      // Error handling already done above
      setError(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Clear current plant details
   */
  const clearPlantDetails = () => {
    setPlantDetails(null);
    setCareDetails(null);
  };

  /**
   * Clear search results
   */
  const clearSearchResults = () => {
    setSearchResults(null);
  };

  /**
   * Clear any errors
   */
  const clearError = () => {
    setError(null);
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return {
    fetchPlantDetails,
    fetchPlantCareDetails,
    searchForPlants,
    clearPlantDetails,
    clearSearchResults,
    clearError,
    isLoading,
    error,
    plantDetails,
    careDetails,
    searchResults,
  };
};
