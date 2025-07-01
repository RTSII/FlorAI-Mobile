/**
 * User Plants API Hook
 * Combines user plants API with state management
 */

import { useState } from 'react';
import { useAppContext } from '../store/AppContext.tsx';
import { 
  getUserPlants,
  addUserPlant,
  updateUserPlant,
  removeUserPlant,
  markPlantAsWatered,
  getWateringSchedule
} from '../api/services/userPlantsService.ts';
import { UserPlant } from '../types/state.ts';

/**
 * Hook for user plants operations
 */
export const useApiUserPlants = () => {
  const { state, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all user plants
   */
  const fetchUserPlants = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await getUserPlants();
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        // Store the user plants in the global state
        dispatch({ 
          type: 'SET_USER_PLANTS', 
          payload: response.data 
        });
        
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
   * Add a plant to user's collection
   */
  const addPlantToCollection = async (plant: Omit<UserPlant, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await addUserPlant(plant);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        // Add the new plant to the global state
        dispatch({ 
          type: 'ADD_USER_PLANT', 
          payload: response.data 
        });
        
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
   * Update a plant in user's collection
   */
  const updatePlantInCollection = async (plant: UserPlant) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await updateUserPlant(plant);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        // Update the plant in the global state
        dispatch({ 
          type: 'UPDATE_USER_PLANT', 
          payload: response.data 
        });
        
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
   * Remove a plant from user's collection
   */
  const removePlantFromCollection = async (plantId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await removeUserPlant(plantId);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return false;
      }
      
      if (response.data?.success) {
        // Remove the plant from the global state
        dispatch({ 
          type: 'REMOVE_USER_PLANT', 
          payload: plantId 
        });
        
        return true;
      }
      
      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      // Error handling already done above
      setError(errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    } finally {
      setIsLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Mark a plant as watered
   */
  const waterPlant = async (plantId: string, wateringDate?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await markPlantAsWatered(plantId, wateringDate);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      if (response.data) {
        // Update the plant in the global state
        dispatch({ 
          type: 'UPDATE_USER_PLANT', 
          payload: response.data 
        });
        
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
   * Get watering schedule for user plants
   */
  const fetchWateringSchedule = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update global loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Call the API
      const response = await getWateringSchedule(startDate, endDate);
      
      if (response.error) {
        setError(response.error.message);
        dispatch({ type: 'SET_ERROR', payload: response.error.message });
        return null;
      }
      
      return response.data || null;
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

  return {
    fetchUserPlants,
    addPlantToCollection,
    updatePlantInCollection,
    removePlantFromCollection,
    waterPlant,
    fetchWateringSchedule,
    isLoading,
    error,
    userPlants: state.userPlants,
  };
};
