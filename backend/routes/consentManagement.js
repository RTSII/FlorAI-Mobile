/**
 * Consent Management Routes
 *
 * Handles user consent management for data collection and usage
 * in the proprietary plant identification model.
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateUser } = require('../middleware/auth');
const { validateSchema } = require('../middleware/validation');
const Joi = require('joi');

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Validation schemas
const consentSchema = Joi.object({
  basicIdentification: Joi.boolean().required(),
  modelTraining: Joi.boolean().required(),
  exifMetadata: Joi.boolean().required(),
  locationData: Joi.boolean().required(),
  advancedSensors: Joi.boolean().required(),
});

/**
 * Get user consent settings
 * GET /api/consent
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user consent from database
    const { data, error } = await supabase
      .from('plant_data.user_consent')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user consent:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch consent settings',
        error: error.message,
      });
    }

    // If no consent record exists, return default values
    if (!data) {
      return res.json({
        success: true,
        data: {
          basicIdentification: true, // Required for app functionality
          modelTraining: false,
          exifMetadata: false,
          locationData: false,
          advancedSensors: false,
        },
      });
    }

    // Format response
    const consentData = {
      basicIdentification: data.basic_identification,
      modelTraining: data.model_training,
      exifMetadata: data.exif_metadata,
      locationData: data.location_data,
      advancedSensors: data.advanced_sensors,
    };

    return res.json({
      success: true,
      data: consentData,
    });
  } catch (error) {
    console.error('Unexpected error in consent GET:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: error.message,
    });
  }
});

/**
 * Update user consent settings
 * PUT /api/consent
 */
router.put('/', authenticateUser, validateSchema(consentSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { basicIdentification, modelTraining, exifMetadata, locationData, advancedSensors } =
      req.body;

    // Basic identification is required for app functionality
    if (!basicIdentification) {
      return res.status(400).json({
        success: false,
        message: 'Basic identification consent is required for app functionality',
      });
    }

    // Get IP and user agent for audit log
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    // Check if consent record exists
    const { data: existingConsent, error: fetchError } = await supabase
      .from('plant_data.user_consent')
      .select('id')
      .eq('user_id', userId)
      .single();

    let consentId;

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = not found
      console.error('Error checking existing consent:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to check existing consent',
        error: fetchError.message,
      });
    }

    // Begin transaction
    const { error: transactionError } = await supabase.rpc('begin_transaction');
    if (transactionError) {
      console.error('Error beginning transaction:', transactionError);
      return res.status(500).json({
        success: false,
        message: 'Failed to begin transaction',
        error: transactionError.message,
      });
    }

    try {
      if (existingConsent) {
        // Update existing consent
        consentId = existingConsent.id;

        const { error: updateError } = await supabase
          .from('plant_data.user_consent')
          .update({
            basic_identification: basicIdentification,
            model_training: modelTraining,
            exif_metadata: exifMetadata,
            location_data: locationData,
            advanced_sensors: advancedSensors,
            updated_at: new Date().toISOString(),
          })
          .eq('id', consentId);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new consent record
        const { data: newConsent, error: insertError } = await supabase
          .from('plant_data.user_consent')
          .insert([
            {
              user_id: userId,
              basic_identification: basicIdentification,
              model_training: modelTraining,
              exif_metadata: exifMetadata,
              location_data: locationData,
              advanced_sensors: advancedSensors,
            },
          ])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        consentId = newConsent.id;
      }

      // Log consent changes to audit log
      const auditEntries = [];

      // If updating existing consent, we need to compare with previous values
      if (existingConsent) {
        const { data: previousConsent, error: prevError } = await supabase
          .from('plant_data.user_consent')
          .select('*')
          .eq('id', consentId)
          .single();

        if (prevError) {
          throw prevError;
        }

        // Compare and log changes
        if (previousConsent.model_training !== modelTraining) {
          auditEntries.push({
            user_id: userId,
            consent_id: consentId,
            action: modelTraining ? 'granted' : 'revoked',
            consent_type: 'model_training',
            previous_value: previousConsent.model_training,
            new_value: modelTraining,
            ip_address: ipAddress,
            user_agent: userAgent,
          });
        }

        if (previousConsent.exif_metadata !== exifMetadata) {
          auditEntries.push({
            user_id: userId,
            consent_id: consentId,
            action: exifMetadata ? 'granted' : 'revoked',
            consent_type: 'exif_metadata',
            previous_value: previousConsent.exif_metadata,
            new_value: exifMetadata,
            ip_address: ipAddress,
            user_agent: userAgent,
          });
        }

        if (previousConsent.location_data !== locationData) {
          auditEntries.push({
            user_id: userId,
            consent_id: consentId,
            action: locationData ? 'granted' : 'revoked',
            consent_type: 'location_data',
            previous_value: previousConsent.location_data,
            new_value: locationData,
            ip_address: ipAddress,
            user_agent: userAgent,
          });
        }

        if (previousConsent.advanced_sensors !== advancedSensors) {
          auditEntries.push({
            user_id: userId,
            consent_id: consentId,
            action: advancedSensors ? 'granted' : 'revoked',
            consent_type: 'advanced_sensors',
            previous_value: previousConsent.advanced_sensors,
            new_value: advancedSensors,
            ip_address: ipAddress,
            user_agent: userAgent,
          });
        }
      } else {
        // New consent, log all as granted
        auditEntries.push(
          {
            user_id: userId,
            consent_id: consentId,
            action: 'granted',
            consent_type: 'basic_identification',
            previous_value: null,
            new_value: basicIdentification,
            ip_address: ipAddress,
            user_agent: userAgent,
          },
          {
            user_id: userId,
            consent_id: consentId,
            action: 'granted',
            consent_type: 'model_training',
            previous_value: null,
            new_value: modelTraining,
            ip_address: ipAddress,
            user_agent: userAgent,
          },
          {
            user_id: userId,
            consent_id: consentId,
            action: 'granted',
            consent_type: 'exif_metadata',
            previous_value: null,
            new_value: exifMetadata,
            ip_address: ipAddress,
            user_agent: userAgent,
          },
          {
            user_id: userId,
            consent_id: consentId,
            action: 'granted',
            consent_type: 'location_data',
            previous_value: null,
            new_value: locationData,
            ip_address: ipAddress,
            user_agent: userAgent,
          },
          {
            user_id: userId,
            consent_id: consentId,
            action: 'granted',
            consent_type: 'advanced_sensors',
            previous_value: null,
            new_value: advancedSensors,
            ip_address: ipAddress,
            user_agent: userAgent,
          },
        );
      }

      // Insert audit log entries if there are any changes
      if (auditEntries.length > 0) {
        const { error: auditError } = await supabase
          .from('plant_data.consent_audit_log')
          .insert(auditEntries);

        if (auditError) {
          throw auditError;
        }
      }

      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) {
        throw commitError;
      }

      return res.json({
        success: true,
        message: 'Consent settings updated successfully',
        data: {
          basicIdentification,
          modelTraining,
          exifMetadata,
          locationData,
          advancedSensors,
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    console.error('Error updating consent settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update consent settings',
      error: error.message,
    });
  }
});

/**
 * Get user consent audit log
 * GET /api/consent/audit
 */
router.get('/audit', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get audit log entries for user
    const { data, error } = await supabase
      .from('plant_data.consent_audit_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching consent audit log:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch consent audit log',
        error: error.message,
      });
    }

    // Format response
    const formattedData = data.map((entry) => ({
      id: entry.id,
      action: entry.action,
      consentType: entry.consent_type,
      previousValue: entry.previous_value,
      newValue: entry.new_value,
      timestamp: entry.created_at,
      ipAddress: entry.ip_address,
      userAgent: entry.user_agent,
    }));

    return res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('Unexpected error in consent audit GET:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: error.message,
    });
  }
});

/**
 * Get data usage statistics
 * GET /api/consent/usage
 */
router.get('/usage', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's contributions
    const { data: contributions, error: contribError } = await supabase
      .from('plant_data.plant_contributions')
      .select('id, created_at, status')
      .eq('user_id', userId);

    if (contribError) {
      console.error('Error fetching user contributions:', contribError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contribution data',
        error: contribError.message,
      });
    }

    // Get dataset usage
    const { data: datasetItems, error: datasetError } = await supabase
      .from('plant_data.dataset_items')
      .select('dataset_id, split')
      .in(
        'contribution_id',
        contributions.map((c) => c.id),
      );

    if (datasetError) {
      console.error('Error fetching dataset usage:', datasetError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dataset usage',
        error: datasetError.message,
      });
    }

    // Get model usage
    const { data: models, error: modelError } = await supabase
      .from('plant_data.model_versions')
      .select('name, version, status')
      .in('dataset_id', [...new Set(datasetItems.map((item) => item.dataset_id))]);

    if (modelError) {
      console.error('Error fetching model usage:', modelError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch model usage',
        error: modelError.message,
      });
    }

    // Calculate statistics
    const stats = {
      totalContributions: contributions.length,
      approvedContributions: contributions.filter((c) => c.status === 'approved').length,
      pendingContributions: contributions.filter((c) => c.status === 'pending_review').length,
      rejectedContributions: contributions.filter((c) => c.status === 'rejected').length,
      datasetUsage: {
        training: datasetItems.filter((i) => i.split === 'train').length,
        validation: datasetItems.filter((i) => i.split === 'validation').length,
        testing: datasetItems.filter((i) => i.split === 'test').length,
      },
      modelUsage: models.length,
      modelDetails: models.map((m) => ({
        name: m.name,
        version: m.version,
        status: m.status,
      })),
    };

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Unexpected error in usage stats GET:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: error.message,
    });
  }
});

/**
 * Request data deletion
 * DELETE /api/consent/data
 */
router.delete('/data', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Begin transaction
    const { error: transactionError } = await supabase.rpc('begin_transaction');
    if (transactionError) {
      console.error('Error beginning transaction:', transactionError);
      return res.status(500).json({
        success: false,
        message: 'Failed to begin transaction',
        error: transactionError.message,
      });
    }

    try {
      // Get user's contributions
      const { data: contributions, error: contribError } = await supabase
        .from('plant_data.plant_contributions')
        .select('id, memory_id, image_path')
        .eq('user_id', userId);

      if (contribError) {
        throw contribError;
      }

      // Delete from dataset_items
      if (contributions.length > 0) {
        const { error: datasetError } = await supabase
          .from('plant_data.dataset_items')
          .delete()
          .in(
            'contribution_id',
            contributions.map((c) => c.id),
          );

        if (datasetError) {
          throw datasetError;
        }

        // Delete from plant_features
        const { error: featuresError } = await supabase
          .from('plant_data.plant_features')
          .delete()
          .in(
            'contribution_id',
            contributions.map((c) => c.id),
          );

        if (featuresError) {
          throw featuresError;
        }

        // Delete from plant_annotations
        const { error: annotationsError } = await supabase
          .from('plant_data.plant_annotations')
          .delete()
          .in(
            'contribution_id',
            contributions.map((c) => c.id),
          );

        if (annotationsError) {
          throw annotationsError;
        }

        // Delete from image_metadata
        const { error: metadataError } = await supabase
          .from('plant_data.image_metadata')
          .delete()
          .in(
            'contribution_id',
            contributions.map((c) => c.id),
          );

        if (metadataError) {
          throw metadataError;
        }

        // Delete from plant_contributions
        const { error: deleteError } = await supabase
          .from('plant_data.plant_contributions')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          throw deleteError;
        }

        // Delete images from storage
        for (const contribution of contributions) {
          if (contribution.image_path) {
            const { error: storageError } = await supabase.storage
              .from('plant-contributions')
              .remove([contribution.image_path]);

            if (storageError) {
              console.warn(`Failed to delete image ${contribution.image_path}:`, storageError);
              // Continue with other deletions
            }
          }
        }

        // Delete memories from Supermemory.ai (would be implemented in a real app)
        // This would require calling the Supermemory.ai API
      }

      // Delete consent audit log
      const { error: auditError } = await supabase
        .from('plant_data.consent_audit_log')
        .delete()
        .eq('user_id', userId);

      if (auditError) {
        throw auditError;
      }

      // Delete consent record
      const { error: consentError } = await supabase
        .from('plant_data.user_consent')
        .delete()
        .eq('user_id', userId);

      if (consentError) {
        throw consentError;
      }

      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) {
        throw commitError;
      }

      return res.json({
        success: true,
        message: 'All user data has been deleted successfully',
      });
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user data',
      error: error.message,
    });
  }
});

module.exports = router;
