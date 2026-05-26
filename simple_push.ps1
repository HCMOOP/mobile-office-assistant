Set-Location "C:\Users\hyh\Desktop\figma"

Write-Host "=== 配置 Git ==="
git config user.email "deploy@example.com"
git config user.name "HCMOOP"

Write-Host ""
Write-Host "=== 添加文件 ==="
git add .

Write-Host ""
Write-Host "=== 提交代码 ==="
git commit -m "Build iOS IPA"

Write-Host ""
Write-Host "=== 推送到 GitHub ==="
git push -u origin master

Write-Host ""
Write-Host "=== 完成 ==="
Write-Host "请刷新 GitHub 页面：https://github.com/HCMOOP/mobile-office-assistant"