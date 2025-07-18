# Test if server is responding
Write-Host "Testing server connection..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/users -UseBasicParsing
    Write-Host "✓ Server is running!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    
    # Try to add a user
    Write-Host "`nAdding a test user..." -ForegroundColor Yellow
    $body = @{
        dni = "12345678"
        name = "Test User"
    } | ConvertTo-Json
    
    $postResponse = Invoke-RestMethod -Uri http://localhost:8000/api/users -Method POST -Body $body -ContentType "application/json"
    Write-Host "✓ User added successfully!" -ForegroundColor Green
    Write-Host "User data: $($postResponse | ConvertTo-Json)" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ Cannot connect to server!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nMake sure the server is running with 'npm run start'" -ForegroundColor Yellow
}