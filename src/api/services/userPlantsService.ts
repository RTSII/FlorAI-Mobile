/**
 * User Plants Service
 * Handles API requests related to user's plant collection and care activities
 */

import { apiClient } from '../apiClient.ts';
import { ENDPOINTS, TIMEOUTS, CACHE_DURATIONS } from '../config.ts';
import { ApiResponse } from '../types.ts';
import { UserPlant } from '../../types/state.ts';

/**
 * Get all plants in the user's collection
 * @returns List of user's plants
 */
export const getUserPlants = async (): Promise<ApiResponse<UserPlant[]>> => {
  return apiClient.get<UserPlant[]>(
    ENDPOINTS.USER_PLANTS,
    {},
    {},
    TIMEOUTS.DEFAULT
  );
};

/**
 * Add a plant to the user's collection
 * @param plant Plant to add
 * @returns Added plant with server-generated ID
 */
export const addUserPlant = async (plant: Omit<UserPlant, 'id'>): Promise<ApiResponse<UserPlant>> => {
  return apiClient.post<UserPlant>(
    ENDPOINTS.USER_PLANTS,
    plant,
    {},
    TIMEOUTS.DEFAULT
  );
};

/**
 * Update a plant in the user's collection
 * @param plant Plant with updated data
 * @returns Updated plant
 */
export const updateUserPlant = async (plant: UserPlant): Promise<ApiResponse<UserPlant>> => {
  return apiClient.put<UserPlant>(
    `${ENDPOINTS.USER_PLANTS}/${plant.id}`,
    plant,
    {},
    TIMEOUTS.DEFAULT
  );
};

/**
 * Remove a plant from the user's collection
 * @param plantId ID of the plant to remove
 * @returns Success status
 */
export const removeUserPlant = async (plantId: string): Promise<ApiResponse<{ success: boolean }>> => {
  return apiClient.delete<{ success: boolean }>(
    `${ENDPOINTS.USER_PLANTS}/${plantId}`,
    {},
    TIMEOUTS.DEFAULT
  );
};

/**
 * Mark a plant as watered
 * @param plantId ID of the plant
 * @param wateringDate Date of watering (defaults to current date)
 * @returns Updated plant
 */
export const markPlantAsWatered = async (
  plantId: string,
  wateringDate: string = new Date().toISOString()
): Promise<ApiResponse<UserPlant>> => {
  return apiClient.patch<UserPlant>(
    `${ENDPOINTS.USER_PLANTS}/${plantId}/water`,
    { wateringDate },
    {},
    TIMEOUTS.DEFAULT
  );
};

/**
 * Get watering schedule for all user plants
 * @param startDate Start date for the schedule
 * @param endDate End date for the schedule
 * @returns Watering schedule for the date range
 */
export const getWateringSchedule = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<Array<{
  date: string;
  plants: UserPlant[];
}>>> => {
  return apiClient.get<Array<{
    date: string;
    plants: UserPlant[];
  }>>(
    `${ENDPOINTS.USER_PLANTS}/watering-schedule`,
    { startDate, endDate },
    {},
    TIMEOUTS.DEFAULT
  );
};
