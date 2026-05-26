@echo off
cls
echo 正在推送代码到 GitHub...
git remote remove origin
git remote add origin https://github.com/HCMOOP/mobile-office-assistant.git
git branch -M main
git add .
git commit -m "Build iOS IPA"
git push -u origin main
echo 推送完成！
pause