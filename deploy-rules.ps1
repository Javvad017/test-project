# deploy-rules.ps1
# Run this in a NEW PowerShell window after `firebase login` completes.
# Usage: .\deploy-rules.ps1

Set-Location "c:\work\islamic\islamic-library"

Write-Host "`n🔧 Deploying Firebase Rules..." -ForegroundColor Cyan

# Deploy RTDB + Storage rules (NOT hosting)
firebase deploy --only database,storage

Write-Host "`n✅ Done! Restart your Next.js dev server and try uploading." -ForegroundColor Green
