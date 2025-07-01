/**
 * Data Processing Service
 * 
 * Handles data cleaning, labeling, and review pipeline for the
 * proprietary plant identification model.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApiError, ApiErrorCode } from '../../api/types';
import dataIntegrationService, { PlantDataRecord, PlantAnnotation } from '../dataIntegration';

// Types for data processing
export interface DataCleaningConfig {
  removeBlurryImages: boolean;
  removeUnderexposedImages: boolean;
  removeOverexposedImages: boolean;
  cropToPlantOnly: boolean;
  enhanceColors: boolean;
  normalizeSize: boolean;
}

export interface LabelingTask {
  id?: string;
  contributionId: string;
  taskType: 'species' | 'health' | 'growth_stage' | 'custom';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewTask {
  id?: string;
  contributionId: string;
  labelingTaskId: string;
  reviewerId: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Data Processing Service class
 * Handles the data cleaning, labeling, and review pipeline
 */
export class DataProcessingService {
  private supabase: SupabaseClient;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Clean plant data based on configuration
   * @param contributionId Plant contribution ID
   * @param config Cleaning configuration
   * @returns Success status
   */
  async cleanData(contributionId: string, config: DataCleaningConfig): Promise<boolean> {
    try {
      // Get the plant data
      const plantData = await dataIntegrationService.getPlantData(contributionId);
      
      if (!plantData) {
        throw new ApiError({
          code: ApiErrorCode.NOT_FOUND,
          message: `Plant data with ID ${contributionId} not found`
        });
      }
      
      // Update cleaning status in database
      const { error } = await this.supabase
        .from('plant_data.data_processing')
        .upsert({
          contribution_id: contributionId,
          cleaning_status: 'in_progress',
          cleaning_config: config,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to update cleaning status: ${error.message}`,
          details: error
        });
      }
      
      // In a real implementation, this would call image processing services
      // For now, we'll simulate the cleaning process with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update cleaning status to completed
      const { error: updateError } = await this.supabase
        .from('plant_data.data_processing')
        .update({
          cleaning_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('contribution_id', contributionId);
      
      if (updateError) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to update cleaning status: ${updateError.message}`,
          details: updateError
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error cleaning data:', error);
      
      // Update cleaning status to failed
      await this.supabase
        .from('plant_data.data_processing')
        .update({
          cleaning_status: 'failed',
          cleaning_error: error instanceof Error ? error.message : 'Unknown error',
          updated_at: new Date().toISOString()
        })
        .eq('contribution_id', contributionId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to clean data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Create a labeling task for a plant contribution
   * @param task Labeling task details
   * @returns Created task with ID
   */
  async createLabelingTask(task: LabelingTask): Promise<LabelingTask> {
    try {
      // Insert task into database
      const { data, error } = await this.supabase
        .from('plant_data.labeling_tasks')
        .insert({
          contribution_id: task.contributionId,
          task_type: task.taskType,
          status: task.status,
          assigned_to: task.assignedTo,
          priority: task.priority
        })
        .select()
        .single();
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to create labeling task: ${error.message}`,
          details: error
        });
      }
      
      return {
        id: data.id,
        contributionId: data.contribution_id,
        taskType: data.task_type,
        status: data.status,
        assignedTo: data.assigned_to,
        priority: data.priority,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error creating labeling task:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to create labeling task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Complete a labeling task with annotation
   * @param taskId Labeling task ID
   * @param annotation Plant annotation
   * @returns Success status
   */
  async completeLabelingTask(taskId: string, annotation: PlantAnnotation): Promise<boolean> {
    try {
      // Begin transaction
      const { error: transactionError } = await this.supabase.rpc('begin_transaction');
      if (transactionError) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to begin transaction: ${transactionError.message}`,
          details: transactionError
        });
      }
      
      try {
        // Get the task
        const { data: task, error: taskError } = await this.supabase
          .from('plant_data.labeling_tasks')
          .select('*')
          .eq('id', taskId)
          .single();
        
        if (taskError) {
          throw new ApiError({
            code: ApiErrorCode.DATABASE_ERROR,
            message: `Failed to get labeling task: ${taskError.message}`,
            details: taskError
          });
        }
        
        if (!task) {
          throw new ApiError({
            code: ApiErrorCode.NOT_FOUND,
            message: `Labeling task with ID ${taskId} not found`
          });
        }
        
        // Add the annotation
        const storedAnnotation = await dataIntegrationService.addAnnotation({
          ...annotation,
          plantDataId: task.contribution_id
        });
        
        // Update task status
        const { error: updateError } = await this.supabase
          .from('plant_data.labeling_tasks')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
            annotation_id: storedAnnotation.id
          })
          .eq('id', taskId);
        
        if (updateError) {
          throw updateError;
        }
        
        // Create review task
        const { error: reviewError } = await this.supabase
          .from('plant_data.review_tasks')
          .insert({
            contribution_id: task.contribution_id,
            labeling_task_id: taskId,
            status: 'pending'
          });
        
        if (reviewError) {
          throw reviewError;
        }
        
        // Commit transaction
        const { error: commitError } = await this.supabase.rpc('commit_transaction');
        if (commitError) {
          throw commitError;
        }
        
        return true;
      } catch (error) {
        // Rollback transaction
        await this.supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error completing labeling task:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to complete labeling task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Review a completed labeling task
   * @param reviewTask Review task details
   * @returns Success status
   */
  async reviewTask(reviewTask: ReviewTask): Promise<boolean> {
    try {
      // Update review task
      const { error } = await this.supabase
        .from('plant_data.review_tasks')
        .update({
          status: reviewTask.status,
          feedback: reviewTask.feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewTask.id);
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to update review task: ${error.message}`,
          details: error
        });
      }
      
      // If approved, update the contribution status
      if (reviewTask.status === 'approved') {
        const { error: contribError } = await this.supabase
          .from('plant_data.plant_contributions')
          .update({
            status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('id', reviewTask.contributionId);
        
        if (contribError) {
          throw new ApiError({
            code: ApiErrorCode.DATABASE_ERROR,
            message: `Failed to update contribution status: ${contribError.message}`,
            details: contribError
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error reviewing task:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to review task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Get pending labeling tasks
   * @param limit Maximum number of tasks
   * @returns Array of labeling tasks
   */
  async getPendingLabelingTasks(limit = 10): Promise<LabelingTask[]> {
    try {
      const { data, error } = await this.supabase
        .from('plant_data.labeling_tasks')
        .select('*')
        .in('status', ['pending', 'in_progress'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit);
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to get pending labeling tasks: ${error.message}`,
          details: error
        });
      }
      
      return data.map(task => ({
        id: task.id,
        contributionId: task.contribution_id,
        taskType: task.task_type,
        status: task.status,
        assignedTo: task.assigned_to,
        priority: task.priority,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
    } catch (error) {
      console.error('Error getting pending labeling tasks:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to get pending labeling tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
  
  /**
   * Get pending review tasks
   * @param reviewerId Reviewer ID (optional)
   * @param limit Maximum number of tasks
   * @returns Array of review tasks
   */
  async getPendingReviewTasks(reviewerId?: string, limit = 10): Promise<ReviewTask[]> {
    try {
      let query = this.supabase
        .from('plant_data.review_tasks')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(limit);
      
      if (reviewerId) {
        query = query.eq('reviewer_id', reviewerId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new ApiError({
          code: ApiErrorCode.DATABASE_ERROR,
          message: `Failed to get pending review tasks: ${error.message}`,
          details: error
        });
      }
      
      return data.map(task => ({
        id: task.id,
        contributionId: task.contribution_id,
        labelingTaskId: task.labeling_task_id,
        reviewerId: task.reviewer_id,
        status: task.status,
        feedback: task.feedback,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
    } catch (error) {
      console.error('Error getting pending review tasks:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        code: ApiErrorCode.UNKNOWN_ERROR,
        message: `Failed to get pending review tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }
  }
}

// Create singleton instance with environment variables
const dataProcessingService = new DataProcessingService(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default dataProcessingService;
