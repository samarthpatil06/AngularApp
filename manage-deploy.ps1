$target = Read-Host "Enter deployment target (AWS or localhost)"

if ($target -eq "AWS") {
    $ip = Read-Host "Enter your current AWS EC2 IPv4 Address"
    
    # Update the .env file for AWS Production mode
    @'
API_BASE_URL=http://{0}:3000
MONGO_URI=mongodb://mongodb:27017/cloud_app_db
'@ -f $ip | Set-Content .env

    Write-Host "Configured for AWS at $ip. Next steps: docker build & push." -ForegroundColor Cyan
} 
else {
    # Revert .env to Localhost configuration
    @'
API_BASE_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/cloud_app_db
'@ | Set-Content .env

    Write-Host "Configured for Localhost." -ForegroundColor Green
}