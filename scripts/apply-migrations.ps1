# Apply database migrations
Write-Host "Applying database migrations..." -ForegroundColor Cyan

# Navigate to the project root
Push-Location $PSScriptRoot/.. 

try {
    # Apply all migrations
    npx supabase db reset
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database migrations applied successfully" -ForegroundColor Green
        
        # Show connection info
        Write-Host "`nSupabase Local Development URLs:" -ForegroundColor Cyan
        Write-Host "- Studio: http://localhost:54323"
        Write-Host "- API: http://localhost:54321"
        Write-Host "- Database: postgresql://postgres:postgres@localhost:54322/postgres"
        
        # Open Studio in default browser
        $openStudio = Read-Host "Open Supabase Studio in browser? (y/n)"
        if ($openStudio -eq 'y') {
            Start-Process "http://localhost:54323"
        }
    } else {
        Write-Host "Failed to apply migrations" -ForegroundColor Red
    }
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
} finally {
    Pop-Location
}
