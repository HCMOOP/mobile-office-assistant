@echo off
cls
echo ================================
echo 一键推送代码到 GitHub
echo ================================
echo.

cd C:\Users\hyh\Desktop\figma

echo 配置 Git...
git config user.email "deploy@example.com"
git config user.name "HCMOOP"

echo.
echo 添加文件...
git add .

echo.
echo 提交代码...
git commit -m "Build iOS IPA"

echo.
echo 推送到 GitHub...
git push -u origin master

echo.
echo ================================
echo ✅ 推送完成！
echo ================================
echo.
echo 请刷新 GitHub 页面：
echo https://github.com/HCMOOP/mobile-office-assistant
echo.
pause