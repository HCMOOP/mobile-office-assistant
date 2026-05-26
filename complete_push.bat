@echo off
echo.
echo ================================
echo 检查 Git 状态
echo ================================
echo.

echo 检查远程仓库...
git remote -v

echo.
echo 检查分支...
git branch

echo.
echo 检查提交状态...
git log --oneline -1

echo.
echo ================================
echo 推送到 GitHub
echo ================================
echo.

git push -u origin master

echo.
echo ================================
echo 完成！
echo ================================
echo.
echo 请访问: https://github.com/HCMOOP/mobile-office-assistant
echo 然后点击 Actions 标签运行工作流
echo.
pause