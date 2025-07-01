/**
 * Data Integration Service
 * 
 * Integrates Supermemory.ai with Supabase for plant data storage,
 * annotation, and analysis for the proprietary plant identification model.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supermemoryService } from '../supermemory';
import { Memory, CreateMemoryParams } from '../supermemory/types';
import { ApiError, ApiErrorCode } from '../../api/types';

// Types for plant data integration
export interface PlantDataRecord {
  id?: string;
  userId: string;
  imageUrl: string;
  scientificName?: string;
  commonName?: string;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
  diseaseInfo?: Record<string, any>;
  locationData?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
  };
  environmentalData?: Record<string, any>;
  exifData?: Record<string, any>;
  sensorData?: Record<string, any>;
  notes?: string;
  memoryId?: string;
  consentStatus: {
    basicIdentification: boolean;
    modelTraining: boolean;
    exifMetadata: boolean;
    locationData: boolean;
    advancedSensors: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PlantAnnotation {
  id?: string;
  plantDataId: string;
  annotationType: 'species' | 'health' | 'growth_stage' | 'custom';
  annotationValue: string;
  confidence?: number;
  source: 'user' | 'expert' | 'system' | 'ai';
  createdAt?: string;
  updatedAt?: string;
}

export interface DataIntegrationConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

/**
 * Data Integration Service class
 * Handles the integration between Supermemory.ai and Supabase
 * for plant data storage, annotation, and analysis
 */
export class DataIntegrationService {
  private supabase: SupabaseClient;
  
  constructor(config: DataIntegrationConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }
  
  /**
   * Store plant data in both Supermemory.ai and Supabase
   * @param data Plant data record
   * @returns Stored plant data with IDs
   */
  async storePlantData(data: PlantDataRecord): Promise<PlantDataRecord> {
    try {
      // First, ensure we have user consent for the data we're storing
      this.validateConsent(data);
      
      // Create memory in Supermemory.ai
      const memoryContent = this.formatMemoryContent(data);
      const memoryParams: CreateMemoryParams = {
        content: memoryContent,
        userId: data.userId,
        metadata: {
          type: 'plant_data',
          scientificName: data.scientificName,
          commonName: data.commonName,
          healthStatus: data.healthStatus,
          imageUrl: data.imageUrl,
          notes: data.notes,
          consentStatus: data.consentStatus
        }
      };
      
      const memory = await supermemoryService.createMemory(memoryParams);
      
      // Store in Supabase with reference to Supermemory
      const supabaseData = {
        ...data,
        memoryId: memory.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Remove data user hasn't consented to share
      const sanitizedData = this.sanitizeDataByConsent(supabaseData);
      
      const { data: storedData, error } = await this.supabase
        .from('plant_data.plant_contributions')
        .insert([sanitizedData])
        .select()
        .single();
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to store plant data in Supabase: ${error.message}`,
          details: error
        });
      }
      
      return {
        ...data,
        id: storedData.id,
        memoryId: memory.id,
        createdAt: storedData.created_at,
        updatedAt: storedData.updated_at
      };
    } catch (error) {
      console.error('Error storing plant data:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to store plant data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Retrieve plant data from both sources and merge
   * @param plantId Plant data ID in Supabase
   * @returns Complete plant data record
   */
  async getPlantData(plantId: string): Promise<PlantDataRecord> {
    try {
      // Get data from Supabase
      const { data: supabaseData, error } = await this.supabase
        .from('plant_data.plant_contributions')
        .select('*')
        .eq('id', plantId)
        .single();
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to retrieve plant data from Supabase: ${error.message}`,
          details: error
        });
      }
      
      if (!supabaseData) {
        throw new ApiError({
          code: ApiErrorCode.NOT_FOUND,
          message: `Plant data with ID ${plantId} not found`
        });
      }
      
      // If we have a memory ID, get the memory from Supermemory.ai
      let memoryData: Memory | null = null;
      
      if (supabaseData.memory_id) {
        try {
          memoryData = await supermemoryService.getMemory(supabaseData.memory_id);
        } catch (memoryError) {
          console.warn(`Could not retrieve memory ${supabaseData.memory_id}:`, memoryError);
          // Continue without memory data
        }
      }
      
      // Merge data
      return this.mapToPlantDataRecord(supabaseData, memoryData);
    } catch (error) {
      console.error('Error retrieving plant data:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to retrieve plant data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Add annotation to plant data
   * @param annotation Plant annotation
   * @returns Stored annotation with ID
   */
  async addAnnotation(annotation: PlantAnnotation): Promise<PlantAnnotation> {
    try {
      // Store annotation in Supabase
      const { data: storedAnnotation, error } = await this.supabase
        .from('plant_data.plant_annotations')
        .insert([{
          contribution_id: annotation.plantDataId,
          label_type: annotation.annotationType,
          label_value: annotation.annotationValue,
          confidence: annotation.confidence,
          source: annotation.source,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to store annotation in Supabase: ${error.message}`,
          details: error
        });
      }
      
      // Get the plant data to update the memory
      const plantData = await this.getPlantData(annotation.plantDataId);
      
      // Update memory in Supermemory.ai if available
      if (plantData.memoryId) {
        try {
          const memory = await supermemoryService.getMemory(plantData.memoryId);
          
          // Add annotation to memory metadata
          const updatedMetadata = {
            ...memory.metadata,
            annotations: [
              ...(memory.metadata?.annotations || []),
              {
                type: annotation.annotationType,
                value: annotation.annotationValue,
                confidence: annotation.confidence,
                source: annotation.source,
                createdAt: storedAnnotation.created_at
              }
            ]
          };
          
          await supermemoryService.updateMemory(plantData.memoryId, {
            metadata: updatedMetadata
          });
        } catch (memoryError) {
          console.warn(`Could not update memory ${plantData.memoryId}:`, memoryError);
          // Continue without updating memory
        }
      }
      
      return {
        ...annotation,
        id: storedAnnotation.id,
        createdAt: storedAnnotation.created_at,
        updatedAt: storedAnnotation.updated_at
      };
    } catch (error) {
      console.error('Error adding annotation:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to add annotation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Search for plant data using Supermemory.ai semantic search
   * @param query Search query
   * @param userId User ID
   * @param limit Maximum number of results
   * @returns Array of matching plant data records
   */
  async searchPlantData(query: string, userId: string, limit = 10): Promise<PlantDataRecord[]> {
    try {
      // Search in Supermemory.ai
      const searchResults = await supermemoryService.searchMemories({
        query,
        userId,
        limit,
        threshold: 0.6
      });
      
      if (!searchResults.length) {
        return [];
      }
      
      // Get matching plant data from Supabase
      const memoryIds = searchResults.map(result => result.id);
      
      const { data: supabaseData, error } = await this.supabase
        .from('plant_data.plant_contributions')
        .select('*')
        .in('memory_id', memoryIds);
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to retrieve plant data from Supabase: ${error.message}`,
          details: error
        });
      }
      
      // Map results and maintain search order
      const resultMap = new Map<string, any>();
      supabaseData.forEach(item => {
        resultMap.set(item.memory_id, item);
      });
      
      return searchResults
        .filter(result => resultMap.has(result.id))
        .map(result => {
          const supabaseItem = resultMap.get(result.id);
          return this.mapToPlantDataRecord(supabaseItem, result);
        });
    } catch (error) {
      console.error('Error searching plant data:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to search plant data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Get all annotations for a plant
   * @param plantId Plant data ID
   * @returns Array of annotations
   */
  async getPlantAnnotations(plantId: string): Promise<PlantAnnotation[]> {
    try {
      const { data, error } = await this.supabase
        .from('plant_data.plant_annotations')
        .select('*')
        .eq('contribution_id', plantId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to retrieve annotations from Supabase: ${error.message}`,
          details: error
        });
      }
      
      return data.map(item => ({
        id: item.id,
        plantDataId: item.contribution_id,
        annotationType: item.label_type,
        annotationValue: item.label_value,
        confidence: item.confidence,
        source: item.source,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error('Error retrieving plant annotations:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to retrieve plant annotations: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Format plant data for Supermemory.ai storage
   * @param data Plant data record
   * @returns Formatted text content
   */
  private formatMemoryContent(data: PlantDataRecord): string {
    const parts = [
      `Plant: ${data.commonName || 'Unknown'} (${data.scientificName || 'Unidentified species'})`,
      `Health: ${data.healthStatus || 'Unknown'}`,
      data.notes ? `Notes: ${data.notes}` : '',
    ].filter(Boolean);
    
    return parts.join('\n\n');
  }
  
  /**
   * Map database record to PlantDataRecord
   * @param supabaseData Data from Supabase
   * @param memoryData Data from Supermemory.ai
   * @returns Merged plant data record
   */
  private mapToPlantDataRecord(supabaseData: any, memoryData: Memory | null): PlantDataRecord {
    return {
      id: supabaseData.id,
      userId: supabaseData.user_id,
      imageUrl: supabaseData.image_url,
      scientificName: supabaseData.scientific_name,
      commonName: supabaseData.common_name,
      healthStatus: supabaseData.is_healthy === true ? 'healthy' : 
                   supabaseData.is_healthy === false ? 'unhealthy' : 'unknown',
      diseaseInfo: supabaseData.disease_info,
      locationData: supabaseData.location_data,
      environmentalData: supabaseData.environmental_data,
      exifData: supabaseData.exif_data,
      sensorData: supabaseData.sensor_data,
      notes: supabaseData.notes,
      memoryId: supabaseData.memory_id,
      consentStatus: this.mapConsentStatus(supabaseData),
      createdAt: supabaseData.created_at,
      updatedAt: supabaseData.updated_at
    };
  }
  
  /**
   * Map database consent fields to consent status object
   * @param data Data from Supabase
   * @returns Consent status object
   */
  private mapConsentStatus(data: any): PlantDataRecord['consentStatus'] {
    // Get consent from user_consent table or use default values
    return {
      basicIdentification: true, // Always required
      modelTraining: data.model_training_consent === true,
      exifMetadata: data.exif_metadata_consent === true,
      locationData: data.location_data_consent === true,
      advancedSensors: data.advanced_sensors_consent === true
    };
  }
  
  /**
   * Validate that we have consent for the data we're storing
   * @param data Plant data record
   * @throws ApiError if consent validation fails
   */
  private validateConsent(data: PlantDataRecord): void {
    // Basic identification is always required
    if (!data.consentStatus.basicIdentification) {
      throw new ApiError({
        code: ApiErrorCode.PERMISSION_DENIED,
        message: 'Basic identification consent is required'
      });
    }
    
    // Check other consent types against data
    if (!data.consentStatus.exifMetadata && data.exifData) {
      throw new ApiError({
        code: ApiErrorCode.PERMISSION_DENIED,
        message: 'Cannot store EXIF data without consent'
      });
    }
    
    if (!data.consentStatus.locationData && data.locationData) {
      throw new ApiError({
        code: ApiErrorCode.PERMISSION_DENIED,
        message: 'Cannot store location data without consent'
      });
    }
    
    if (!data.consentStatus.advancedSensors && data.sensorData) {
      throw new ApiError({
        code: ApiErrorCode.PERMISSION_DENIED,
        message: 'Cannot store sensor data without consent'
      });
    }
  }
  
  /**
   * Remove data that user hasn't consented to share
   * @param data Plant data record
   * @returns Sanitized data object
   */
  private sanitizeDataByConsent(data: any): any {
    const sanitized = { ...data };
    
    // Remove data based on consent
    if (!data.consentStatus.exifMetadata) {
      delete sanitized.exifData;
    }
    
    if (!data.consentStatus.locationData) {
      delete sanitized.locationData;
    }
    
    if (!data.consentStatus.advancedSensors) {
      delete sanitized.sensorData;
    }
    
    return sanitized;
  }
}

// Create singleton instance with environment variables
const dataIntegrationService = new DataIntegrationService({
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_ANON_KEY || ''
});

export default dataIntegrationService;
