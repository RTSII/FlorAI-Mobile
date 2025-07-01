#!/bin/bash

# Exit on error
set -e

# Variables
PROJECT_ID="forward-robot-456807-g6"
SERVICE_ACCOUNT_NAME="florai-service-account"
SERVICE_ACCOUNT_DISPLAY_NAME="FlorAI Service Account"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="${PWD}/gcp-service-account-key.json"

# Enable required APIs
echo "Enabling required Google Cloud APIs..."
gcloud services enable \
    vision.googleapis.com \
    aiplatform.googleapis.com \
    cloudfunctions.googleapis.com \
    run.googleapis.com \
    storage-component.googleapis.com \
    --project=${PROJECT_ID}

# Create service account if it doesn't exist
echo "Setting up service account..."
if ! gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL} --project=${PROJECT_ID} >/dev/null 2>&1; then
    gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
        --display-name="${SERVICE_ACCOUNT_DISPLAY_NAME}" \
        --project=${PROJECT_ID}
fi

# Assign required roles
echo "Assigning roles to service account..."
ROLES=(
    "roles/aiplatform.user"
    "roles/vision.admin"
    "roles/cloudfunctions.developer"
    "roles/run.admin"
    "roles/storage.admin"
    "roles/iam.serviceAccountUser"
)

for ROLE in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding ${PROJECT_ID} \
        --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
        --role="${ROLE}" \
        --condition=None

done

# Create and download service account key
echo "Creating service account key..."
gcloud iam service-accounts keys create ${KEY_FILE} \
    --iam-account=${SERVICE_ACCOUNT_EMAIL} \
    --project=${PROJECT_ID}

echo "Service account key created at: ${KEY_FILE}"
echo "Make sure to add this file to your .gitignore!"

# Create Cloud Storage bucket for AI models
echo "Creating Cloud Storage bucket for AI models..."
BUCKET_NAME="${PROJECT_ID}-ai-models"
gsutil mb -p ${PROJECT_ID} -l us-central1 gs://${BUCKET_NAME} || true

echo "Google Cloud setup complete!"
echo "Next steps:"
echo "1. Add ${KEY_FILE} to your .gitignore file"
echo "2. Update your .env file with the service account key path"
echo "3. Run 'gcloud auth application-default login' to authenticate"
