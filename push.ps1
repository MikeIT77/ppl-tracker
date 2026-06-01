$msg = if ($args[0]) { $args[0] } else { "update $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
git add .
git commit -m $msg
git push origin main
Write-Host "✓ Pushed to GitHub — live in ~60 seconds" -ForegroundColor Green
