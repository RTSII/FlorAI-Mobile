# PowerShell script to test Supermemory API with curl
# Load environment variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        if ($name -and $value) {
            [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
        }
    }
}

# Get environment variables
$apiKey = [System.Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPERMEMORY_API_KEY")
$apiUrl = [System.Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPERMEMORY_API_URL")

if (-not $apiKey) {
    Write-Host "❌ Error: NEXT_PUBLIC_SUPERMEMORY_API_KEY is not set in environment" -ForegroundColor Red
    exit 1
}

if (-not $apiUrl) {
    $apiUrl = "https://mcp.supermemory.ai"
    Write-Host "ℹ️ Using default API URL: $apiUrl" -ForegroundColor Yellow
}

# Prepare headers
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$healthUrl = "$apiUrl/api/v1/health"

# Display test information
Write-Host "`n=== Testing Supermemory API ===" -ForegroundColor Cyan
Write-Host "API URL: $healthUrl"
Write-Host "API Key: ***$($apiKey.Substring($apiKey.Length - 4))"

# Make the API request
try {
    Write-Host "`nSending GET request to /health endpoint..." -ForegroundColor Cyan
    
    # Create web request parameters
    $params = @{
        Uri = $healthUrl
        Method = 'GET'
        Headers = $headers
        TimeoutSec = 10
        ErrorAction = 'Stop'
    }
    
    # Add verbose output
    Write-Host "Request details:" -ForegroundColor Cyan
    $params | Format-Table -AutoSize | Out-String | Write-Host -ForegroundColor Cyan
    
    # Make the request
    $response = Invoke-RestMethod @params
    
    # Display success response
    Write-Host "`n✅ Success! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
    
} catch [System.Net.WebException] {
    # Handle web exceptions
    Write-Host "`n❌ WebException occurred:" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Status)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        
        Write-Host "Response status: $($_.Exception.Response.StatusCode) $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    } else {
        Write-Host "No response received. Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    # Handle other exceptions
    Write-Host "`n❌ An error occurred:" -ForegroundColor Red
    Write-Host "Error Type: $($_.Exception.GetType().FullName)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "Error Details: $($_.ErrorDetails)" -ForegroundColor Red
    }
    
    if ($_.ScriptStackTrace) {
        Write-Host "`nStack Trace:" -ForegroundColor Red
        Write-Host $_.ScriptStackTrace -ForegroundColor Red
    }
}

Write-Host "`nTest completed." -ForegroundColor Cyan
