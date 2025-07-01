/**
 * Plant Identification API Hook
 * Combines plant identification API with state management
 */

import { useState } from 'react';
import { useAppContext } from '../store/AppContext.tsx';
import { 
  identifyPlant, 
  getSimilarPlants 
} from '../api/services/plantIdentificationService.ts';
import { 
  PlantIdentificationRequest, 
  PlantIdentificationResponse 
} from '../api/types.ts';

/**
 * Hook for plant identification operations
 */
export const useApiPlantIdentification = () => {
  const { state, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Identify a plant from images
   */
  const identifyPlantFromImages = async (request: PlantIdentificationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await identifyPlant(request);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        // Store the identified plant in the global state
        if (response.data.results && response.data.results.length > 0) {
          const identifiedPlants = response.data.results.map(result => ({
            id: result.id,
            scientificName: result.scientificName,
            commonName: result.commonName,
            family: result.family,
            probability: result.probability,
            identifiedAt: new Date().toISOString(),
          }));
          
          dispatch({ 
            type: 'SET_IDENTIFIED_PLANTS', 
            payload: identifiedPlants 
          });
        }
        
        return response.data;
      }
      
      return null;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to identify plant';
      setError(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Get similar plants based on an identified plant
   */
  const findSimilarPlants = async (plantId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await getSimilarPlants(plantId);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      return response.data || null;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to find similar plants';
      setError(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    identifyPlantFromImages,
    findSimilarPlants,
    isLoading,
    error,
    identifiedPlants: state.identifiedPlants,
  };
};
