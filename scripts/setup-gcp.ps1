# Google Cloud Setup Script for Windows
# This script sets up the Google Cloud project with required APIs and service accounts

# Variables
$PROJECT_ID = "forward-robot-456807-g6"
$SERVICE_ACCOUNT_NAME = "florai-service-account"
$SERVICE_ACCOUNT_DISPLAY_NAME = "FlorAI Service Account"
$SERVICE_ACCOUNT_EMAIL = "${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
$KEY_FILE = "${PWD}\gcp-service-account-key.json"

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Error "Google Cloud SDK is not installed. Please install it from https://cloud.google.com/sdk/docs/install"
    exit 1
}

# Authenticate with Google Cloud
Write-Host "Authenticating with Google Cloud..." -ForegroundColor Cyan
gcloud auth login

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "Enabling required Google Cloud APIs..." -ForegroundColor Cyan
$APIS = @(
    "vision.googleapis.com",
    "aiplatform.googleapis.com",
    "cloudfunctions.googleapis.com",
    "run.googleapis.com",
    "storage-component.googleapis.com"
)

foreach ($API in $APIS) {
    Write-Host "Enabling $API..."
    gcloud services enable $API --project=$PROJECT_ID
}

# Create service account if it doesn't exist
Write-Host "Setting up service account..." -ForegroundColor Cyan
$serviceAccountExists = gcloud iam service-accounts list --format="value(email)" --project=$PROJECT_ID | Select-String -Pattern $SERVICE_ACCOUNT_EMAIL

if (-not $serviceAccountExists) {
    Write-Host "Creating service account $SERVICE_ACCOUNT_EMAIL..."
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME `
        --display-name="$SERVICE_ACCOUNT_DISPLAY_NAME" `
        --project=$PROJECT_ID
}

# Assign required roles
Write-Host "Assigning roles to service account..." -ForegroundColor Cyan
$ROLES = @(
    "roles/aiplatform.user",
    "roles/vision.admin",
    "roles/cloudfunctions.developer",
    "roles/run.admin",
    "roles/storage.admin",
    "roles/iam.serviceAccountUser"
)

foreach ($ROLE in $ROLES) {
    Write-Host "Assigning role $ROLE..."
    gcloud projects add-iam-policy-binding $PROJECT_ID `
        --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" `
        --role="${ROLE}" `
        --condition=None
}

# Create and download service account key
Write-Host "Creating service account key..." -ForegroundColor Cyan
if (Test-Path $KEY_FILE) {
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $backupFile = "${KEY_FILE}.${timestamp}.bak"
    Write-Host "Backing up existing key to $backupFile"
    Move-Item -Path $KEY_FILE -Destination $backupFile -Force
}

gcloud iam service-accounts keys create $KEY_FILE `
    --iam-account=$SERVICE_ACCOUNT_EMAIL `
    --project=$PROJECT_ID

# Create Cloud Storage bucket for AI models
Write-Host "Creating Cloud Storage bucket for AI models..." -ForegroundColor Cyan
$BUCKET_NAME = "${PROJECT_ID}-ai-models"
gsutil mb -p $PROJECT_ID -l us-central1 gs://$BUCKET_NAME

# Set environment variables
$env:GOOGLE_CLOUD_PROJECT = $PROJECT_ID
$env:GOOGLE_APPLICATION_CREDENTIALS = $KEY_FILE

# Add to .gitignore if not already present
$gitignorePath = "${PWD}\.gitignore"
if (-not (Test-Path $gitignorePath)) {
    New-Item -ItemType File -Path $gitignorePath -Force | Out-Null
}

$gitignoreContent = Get-Content $gitignorePath -ErrorAction SilentlyContinue
if ($gitignoreContent -notcontains "gcp-service-account-key.json") {
    Add-Content -Path $gitignorePath -Value "`ngcp-service-account-key.json"
}

Write-Host "`n✅ Google Cloud setup complete!" -ForegroundColor Green
Write-Host "Service account key created at: $KEY_FILE"
Write-Host "Make sure to keep this file secure and never commit it to version control!" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. The service account key has been added to your .gitignore file"
Write-Host "2. Update your .env file with the service account key path:"
Write-Host "   GOOGLE_APPLICATION_CREDENTIALS=$KEY_FILE"
Write-Host "3. Run 'gcloud auth application-default login' to authenticate with your user account"
