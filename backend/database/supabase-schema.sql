-- FlorAI-Mobile Supabase Database Schema
-- This schema defines the tables and relationships for storing plant data
-- contributed by users for the proprietary plant identification model.

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create schema for plant data
CREATE SCHEMA IF NOT EXISTS plant_data;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create extension for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create extension for vector operations (for ML embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- ===============================
-- User Consent Management Tables
-- ===============================

-- User consent records
CREATE TABLE IF NOT EXISTS plant_data.user_consent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  basic_identification BOOLEAN NOT NULL DEFAULT TRUE,
  model_training BOOLEAN NOT NULL DEFAULT FALSE,
  exif_metadata BOOLEAN NOT NULL DEFAULT FALSE,
  location_data BOOLEAN NOT NULL DEFAULT FALSE,
  advanced_sensors BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consent audit log for compliance
CREATE TABLE IF NOT EXISTS plant_data.consent_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_id UUID NOT NULL REFERENCES plant_data.user_consent(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'granted', 'revoked', 'updated'
  consent_type VARCHAR(50) NOT NULL, -- 'basic_identification', 'model_training', etc.
  previous_value BOOLEAN,
  new_value BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT
);

-- ===============================
-- Plant Contribution Tables
-- ===============================

-- Plant contributions from users
CREATE TABLE IF NOT EXISTS plant_data.plant_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scientific_name VARCHAR(255),
  common_name VARCHAR(255),
  family VARCHAR(255),
  is_healthy BOOLEAN,
  disease_info JSONB,
  growing_conditions JSONB,
  location_data JSONB,
  notes TEXT,
  image_path TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'approved', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Image metadata (EXIF and sensor data)
CREATE TABLE IF NOT EXISTS plant_data.image_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contribution_id UUID NOT NULL REFERENCES plant_data.plant_contributions(id) ON DELETE CASCADE,
  exif_data JSONB,
  device_info JSONB,
  spectral_data JSONB,
  environmental_data JSONB,
  weather_context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plant annotations (for training data)
CREATE TABLE IF NOT EXISTS plant_data.plant_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contribution_id UUID NOT NULL REFERENCES plant_data.plant_contributions(id) ON DELETE CASCADE,
  annotator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for system annotations
  label_type VARCHAR(50) NOT NULL, -- 'species', 'health', 'growth_stage', etc.
  label_value TEXT NOT NULL,
  confidence FLOAT,
  source VARCHAR(50) NOT NULL, -- 'user', 'expert', 'system', 'consensus'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plant features extracted for ML
CREATE TABLE IF NOT EXISTS plant_data.plant_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contribution_id UUID NOT NULL REFERENCES plant_data.plant_contributions(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL, -- 'color_histogram', 'texture', 'shape', 'embedding', etc.
  feature_data JSONB NOT NULL,
  embedding VECTOR(1536), -- For ML embeddings (e.g., from vision models)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================
-- Identification Feedback Tables
-- ===============================

-- User feedback on identifications
CREATE TABLE IF NOT EXISTS plant_data.identification_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identification_id TEXT NOT NULL, -- ID from identification service
  is_correct BOOLEAN NOT NULL,
  data_usage_consent BOOLEAN NOT NULL DEFAULT FALSE,
  correct_scientific_name VARCHAR(255),
  correct_common_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===============================
-- Dataset Management Tables
-- ===============================

-- Dataset definitions
CREATE TABLE IF NOT EXISTS plant_data.datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  source VARCHAR(50) NOT NULL, -- 'user_contributed', 'external', 'synthetic'
  status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'ready', 'archived'
  total_samples INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dataset items (mapping contributions to datasets)
CREATE TABLE IF NOT EXISTS plant_data.dataset_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dataset_id UUID NOT NULL REFERENCES plant_data.datasets(id) ON DELETE CASCADE,
  contribution_id UUID NOT NULL REFERENCES plant_data.plant_contributions(id) ON DELETE CASCADE,
  split VARCHAR(20) NOT NULL DEFAULT 'train', -- 'train', 'validation', 'test'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(dataset_id, contribution_id)
);

-- ===============================
-- Model Training Tables
-- ===============================

-- Model versions
CREATE TABLE IF NOT EXISTS plant_data.model_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  architecture TEXT NOT NULL,
  dataset_id UUID NOT NULL REFERENCES plant_data.datasets(id) ON DELETE RESTRICT,
  hyperparameters JSONB,
  metrics JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'training', -- 'training', 'completed', 'failed', 'deployed'
  model_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name, version)
);

-- ===============================
-- Row Level Security Policies
-- ===============================

-- Enable RLS on all tables
ALTER TABLE plant_data.user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.consent_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.plant_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.plant_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.plant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.identification_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.dataset_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_data.model_versions ENABLE ROW LEVEL SECURITY;

-- User consent policies
CREATE POLICY user_consent_select ON plant_data.user_consent
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ? 'is_admin');

CREATE POLICY user_consent_insert ON plant_data.user_consent
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_consent_update ON plant_data.user_consent
  FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ? 'is_admin');

-- Plant contributions policies
CREATE POLICY plant_contributions_select ON plant_data.plant_contributions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.jwt() ? 'is_admin' OR
    (status = 'approved' AND EXISTS (
      SELECT 1 FROM plant_data.user_consent
      WHERE user_id = plant_data.plant_contributions.user_id
      AND model_training = TRUE
    ))
  );

CREATE POLICY plant_contributions_insert ON plant_data.plant_contributions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY plant_contributions_update ON plant_data.plant_contributions
  FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ? 'is_admin');

-- Image metadata policies
CREATE POLICY image_metadata_select ON plant_data.image_metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM plant_data.plant_contributions
      WHERE id = plant_data.image_metadata.contribution_id
      AND (
        user_id = auth.uid() OR
        auth.jwt() ? 'is_admin' OR
        (status = 'approved' AND EXISTS (
          SELECT 1 FROM plant_data.user_consent
          WHERE user_id = plant_data.plant_contributions.user_id
          AND exif_metadata = TRUE
        ))
      )
    )
  );

-- ===============================
-- Indexes for Performance
-- ===============================

-- User consent indexes
CREATE INDEX IF NOT EXISTS idx_user_consent_user_id ON plant_data.user_consent(user_id);

-- Plant contributions indexes
CREATE INDEX IF NOT EXISTS idx_plant_contributions_user_id ON plant_data.plant_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_contributions_status ON plant_data.plant_contributions(status);
CREATE INDEX IF NOT EXISTS idx_plant_contributions_scientific_name ON plant_data.plant_contributions(scientific_name);
CREATE INDEX IF NOT EXISTS idx_plant_contributions_is_healthy ON plant_data.plant_contributions(is_healthy);

-- Image metadata indexes
CREATE INDEX IF NOT EXISTS idx_image_metadata_contribution_id ON plant_data.image_metadata(contribution_id);

-- Plant annotations indexes
CREATE INDEX IF NOT EXISTS idx_plant_annotations_contribution_id ON plant_data.plant_annotations(contribution_id);
CREATE INDEX IF NOT EXISTS idx_plant_annotations_label_type_value ON plant_data.plant_annotations(label_type, label_value);

-- Plant features indexes
CREATE INDEX IF NOT EXISTS idx_plant_features_contribution_id ON plant_data.plant_features(contribution_id);
CREATE INDEX IF NOT EXISTS idx_plant_features_feature_type ON plant_data.plant_features(feature_type);

-- Create vector index for embeddings
CREATE INDEX IF NOT EXISTS idx_plant_features_embedding ON plant_data.plant_features USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ===============================
-- Functions and Triggers
-- ===============================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION plant_data.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_consent
CREATE TRIGGER update_user_consent_timestamp
BEFORE UPDATE ON plant_data.user_consent
FOR EACH ROW EXECUTE FUNCTION plant_data.update_timestamp();

-- Trigger for plant_contributions
CREATE TRIGGER update_plant_contributions_timestamp
BEFORE UPDATE ON plant_data.plant_contributions
FOR EACH ROW EXECUTE FUNCTION plant_data.update_timestamp();

-- Trigger for plant_annotations
CREATE TRIGGER update_plant_annotations_timestamp
BEFORE UPDATE ON plant_data.plant_annotations
FOR EACH ROW EXECUTE FUNCTION plant_data.update_timestamp();

-- Trigger for plant_features
CREATE TRIGGER update_plant_features_timestamp
BEFORE UPDATE ON plant_data.plant_features
FOR EACH ROW EXECUTE FUNCTION plant_data.update_timestamp();

-- Function to log consent changes
CREATE OR REPLACE FUNCTION plant_data.log_consent_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Log initial consent
    INSERT INTO plant_data.consent_audit_log (
      user_id, consent_id, action, consent_type, previous_value, new_value
    ) VALUES
      (NEW.user_id, NEW.id, 'granted', 'basic_identification', NULL, NEW.basic_identification),
      (NEW.user_id, NEW.id, 'granted', 'model_training', NULL, NEW.model_training),
      (NEW.user_id, NEW.id, 'granted', 'exif_metadata', NULL, NEW.exif_metadata),
      (NEW.user_id, NEW.id, 'granted', 'location_data', NULL, NEW.location_data),
      (NEW.user_id, NEW.id, 'granted', 'advanced_sensors', NULL, NEW.advanced_sensors);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log changes to basic_identification
    IF NEW.basic_identification IS DISTINCT FROM OLD.basic_identification THEN
      INSERT INTO plant_data.consent_audit_log (
        user_id, consent_id, action, consent_type, previous_value, new_value
      ) VALUES (
        NEW.user_id, NEW.id, 
        CASE WHEN NEW.basic_identification THEN 'granted' ELSE 'revoked' END,
        'basic_identification', OLD.basic_identification, NEW.basic_identification
      );
    END IF;
    
    -- Log changes to model_training
    IF NEW.model_training IS DISTINCT FROM OLD.model_training THEN
      INSERT INTO plant_data.consent_audit_log (
        user_id, consent_id, action, consent_type, previous_value, new_value
      ) VALUES (
        NEW.user_id, NEW.id, 
        CASE WHEN NEW.model_training THEN 'granted' ELSE 'revoked' END,
        'model_training', OLD.model_training, NEW.model_training
      );
    END IF;
    
    -- Log changes to exif_metadata
    IF NEW.exif_metadata IS DISTINCT FROM OLD.exif_metadata THEN
      INSERT INTO plant_data.consent_audit_log (
        user_id, consent_id, action, consent_type, previous_value, new_value
      ) VALUES (
        NEW.user_id, NEW.id, 
        CASE WHEN NEW.exif_metadata THEN 'granted' ELSE 'revoked' END,
        'exif_metadata', OLD.exif_metadata, NEW.exif_metadata
      );
    END IF;
    
    -- Log changes to location_data
    IF NEW.location_data IS DISTINCT FROM OLD.location_data THEN
      INSERT INTO plant_data.consent_audit_log (
        user_id, consent_id, action, consent_type, previous_value, new_value
      ) VALUES (
        NEW.user_id, NEW.id, 
        CASE WHEN NEW.location_data THEN 'granted' ELSE 'revoked' END,
        'location_data', OLD.location_data, NEW.location_data
      );
    END IF;
    
    -- Log changes to advanced_sensors
    IF NEW.advanced_sensors IS DISTINCT FROM OLD.advanced_sensors THEN
      INSERT INTO plant_data.consent_audit_log (
        user_id, consent_id, action, consent_type, previous_value, new_value
      ) VALUES (
        NEW.user_id, NEW.id, 
        CASE WHEN NEW.advanced_sensors THEN 'granted' ELSE 'revoked' END,
        'advanced_sensors', OLD.advanced_sensors, NEW.advanced_sensors
      );
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for consent audit logging
CREATE TRIGGER log_consent_changes
AFTER INSERT OR UPDATE ON plant_data.user_consent
FOR EACH ROW EXECUTE FUNCTION plant_data.log_consent_changes();

-- Function to update dataset item counts
CREATE OR REPLACE FUNCTION plant_data.update_dataset_item_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE plant_data.datasets
    SET total_samples = total_samples + 1
    WHERE id = NEW.dataset_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE plant_data.datasets
    SET total_samples = total_samples - 1
    WHERE id = OLD.dataset_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for dataset item count
CREATE TRIGGER update_dataset_item_count
AFTER INSERT OR DELETE ON plant_data.dataset_items
FOR EACH ROW EXECUTE FUNCTION plant_data.update_dataset_item_count();
