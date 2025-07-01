-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with Supermemory reference
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  memory_id TEXT -- Reference to Supermemory memory for this user
);

-- User preferences (1:1 with users)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'en',
  measurement_system TEXT DEFAULT 'metric',
  notification_enabled BOOLEAN DEFAULT true,
  notification_time TIME DEFAULT '09:00:00',
  memory_id TEXT, -- Reference to Supermemory memory for preferences
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plants catalog (known plants)
CREATE TABLE IF NOT EXISTS public.plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scientific_name TEXT NOT NULL,
  common_name TEXT,
  family TEXT,
  description TEXT,
  care_instructions JSONB,
  memory_id TEXT, -- Reference to Supermemory memory for plant knowledge
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's plant collection
CREATE TABLE IF NOT EXISTS public.user_plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
  nickname TEXT,
  location TEXT,
  acquired_date DATE,
  memory_id TEXT, -- Reference to Supermemory memory for this plant instance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plant care logs
CREATE TABLE IF NOT EXISTS public.plant_care_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_plant_id UUID REFERENCES public.user_plants(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL, -- 'watering', 'fertilizing', 'repotting', 'pruning', 'other'
  notes TEXT,
  memory_id TEXT, -- Reference to Supermemory memory for this care log
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plant health observations
CREATE TABLE IF NOT EXISTS public.plant_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_plant_id UUID REFERENCES public.user_plants(id) ON DELETE CASCADE,
  observation TEXT NOT NULL,
  health_status TEXT, -- 'healthy', 'needs_attention', 'sick', 'recovering'
  memory_id TEXT, -- Reference to Supermemory memory for health observations
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_health ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_plants_user_id ON public.user_plants(user_id);
CREATE INDEX IF NOT EXISTS idx_plant_care_logs_user_plant_id ON public.plant_care_logs(user_plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_health_user_plant_id ON public.plant_health(user_plant_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plants_updated_at
BEFORE UPDATE ON public.plants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plants_updated_at
BEFORE UPDATE ON public.user_plants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plant_care_logs_updated_at
BEFORE UPDATE ON public.plant_care_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plant_health_updated_at
BEFORE UPDATE ON public.plant_health
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
