#!/bin/bash

# Exit on error
set -e

# Variables
PROJECT_NAME="FlorAI-Mobile"
LOCAL_SUPABASE_DIR="./supabase"
ENV_FILE=".env"

# Install Supabase CLI if not installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase --save-dev
fi

# Initialize Supabase project
if [ ! -d "$LOCAL_SUPABASE_DIR" ]; then
    echo "Initializing Supabase project..."
    supabase init
else
    echo "Supabase project already initialized at $LOCAL_SUPABASE_DIR"
fi

# Create .env file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "\n# Supabase Configuration" >> .env
    echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url" >> .env
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key" >> .env
    echo "SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key" >> .env
    echo "SUPABASE_DB_PASSWORD=$(openssl rand -base64 32)" >> .env
    
    echo "\n# Update the .env file with your Supabase credentials after project creation"
fi

# Start Supabase services
echo "Starting Supabase services..."
supabase start

echo "\nSupabase setup complete!"
echo "Next steps:"
echo "1. Create a new project at https://app.supabase.com/"
echo "2. Update the .env file with your Supabase project credentials"
echo "3. Run database migrations with 'supabase db push'"
