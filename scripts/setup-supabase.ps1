# Supabase Setup Script for Windows
# This script helps set up Supabase for local development

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
}

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check if Supabase CLI is installed
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Supabase CLI globally..." -ForegroundColor Cyan
    npm install -g supabase --save-dev
    if (-not $?) {
        Write-Error "Failed to install Supabase CLI"
        exit 1
    }
}

# Create .env file if it doesn't exist
$envFile = ".\.env"
$envExample = ".\.env.example"

if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Cyan
    if (Test-Path $envExample) {
        Copy-Item $envExample $envFile
        Write-Host "Created .env file" -ForegroundColor Green
    } else {
        Write-Host ".env.example not found, creating a new .env file" -ForegroundColor Yellow
        Set-Content -Path $envFile -Value "# Supabase Configuration"
    }
    
    # Add Supabase configuration
    Add-Content -Path $envFile -Value "`n# Supabase Configuration"
    Add-Content -Path $envFile -Value "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url"
    Add-Content -Path $envFile -Value "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key"
    Add-Content -Path $envFile -Value "SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key"
    
    # Generate a secure database password
    $dbPassword = -join ((65..90) + (97..122) + (48..57) + (33, 35, 36, 37, 38, 42, 64, 94) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Add-Content -Path $envFile -Value "DATABASE_PASSWORD=$dbPassword"
    
    Write-Host "Updated .env file with Supabase configuration" -ForegroundColor Green
}

# Initialize Supabase if not already initialized
$supabaseDir = ".\supabase"
if (-not (Test-Path $supabaseDir)) {
    Write-Host "Initializing Supabase project..." -ForegroundColor Cyan
    supabase init
    if (-not $?) {
        Write-Error "Failed to initialize Supabase project"
        exit 1
    }
    Write-Host "Supabase project initialized" -ForegroundColor Green
} else {
    Write-Host "Supabase project already initialized at $supabaseDir" -ForegroundColor Yellow
}

# Start Supabase services
Write-Host "`nStarting Supabase services..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    $supabaseStart = Start-Process -FilePath "supabase" -ArgumentList "start" -NoNewWindow -PassThru -Wait
    if ($supabaseStart.ExitCode -ne 0) {
        throw "Failed to start Supabase services"
    }
    
    Write-Host "`n✅ Supabase setup complete!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Create a new project at https://app.supabase.com/"
    Write-Host "2. Update the .env file with your Supabase project credentials:"
    Write-Host "   - NEXT_PUBLIC_SUPABASE_URL"
    Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    Write-Host "   - SUPABASE_SERVICE_ROLE_KEY"
    Write-Host "3. Run 'supabase db push' to apply database migrations"
    Write-Host "4. Start the development server with 'npm run dev'"
} catch {
    Write-Error "Failed to start Supabase services: $_"
    Write-Host "You can try starting Supabase manually with: supabase start" -ForegroundColor Yellow
    exit 1
}
