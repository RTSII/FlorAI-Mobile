import { useAppContext } from '../store/AppContext.tsx';
import { Plant, UserPlant } from '../types/state.ts';

/**
 * Hook to manage plant-related state and actions
 * Provides functions for managing user plants and identified plants
 */
export const usePlants = () => {
  const { state, dispatch } = useAppContext();
  
  // User's plant collection
  const addUserPlant = (plant: UserPlant) => {
    dispatch({ type: 'ADD_USER_PLANT', payload: plant });
  };
  
  const removeUserPlant = (plantId: string) => {
    dispatch({ type: 'REMOVE_USER_PLANT', payload: plantId });
  };
  
  const updateUserPlant = (plant: UserPlant) => {
    dispatch({ type: 'UPDATE_USER_PLANT', payload: plant });
  };
  
  // Recently identified plants
  const addIdentifiedPlant = (plant: Plant) => {
    dispatch({ type: 'ADD_IDENTIFIED_PLANT', payload: plant });
  };
  
  const clearIdentifiedPlants = () => {
    dispatch({ type: 'CLEAR_IDENTIFIED_PLANTS' });
  };
  
  // Helper function to mark a plant as watered
  const markPlantAsWatered = (plantId: string) => {
    const plant = state.userPlants.find((p: UserPlant) => p.id === plantId);
    if (plant) {
      const now = new Date().toISOString();
      // Calculate next watering date based on frequency (simplified)
      // In a real app, this would be more sophisticated
      const nextWatering = new Date();
      
      // Simple logic - add 7 days for now
      nextWatering.setDate(nextWatering.getDate() + 7);
      
      updateUserPlant({
        ...plant,
        lastWatered: now,
        nextWateringDate: nextWatering.toISOString()
      });
    }
  };
  
  return {
    userPlants: state.userPlants,
    recentlyIdentified: state.recentlyIdentified,
    addUserPlant,
    removeUserPlant,
    updateUserPlant,
    addIdentifiedPlant,
    clearIdentifiedPlants,
    markPlantAsWatered,
    
    // Derived data
    plantCount: state.userPlants.length,
    plantsNeedingWater: state.userPlants.filter(plant => {
      if (!plant.nextWateringDate) return false;
      return new Date(plant.nextWateringDate) <= new Date();
    }),
  };
};
