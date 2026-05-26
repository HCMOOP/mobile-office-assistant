@echo off
setlocal enabledelayedexpansion

echo ============================
echo 推送到 GitHub 并构建 iOS IPA
echo ============================

set "GIT_USERNAME=你的GitHub用户名"
set "GIT_REPO=你的仓库名"

echo.
echo 请输入你的 GitHub 用户名:
set /p GIT_USERNAME=

echo.
echo 请输入你的仓库名:
set /p GIT_REPO=

echo.
echo 正在配置 Git...
git config user.email "you@example.com"
git config user.name "%GIT_USERNAME%"

echo.
echo 正在添加文件...
git add .

echo.
echo 正在提交...
git commit -m "Build iOS IPA"

echo.
echo 正在设置远程仓库...
git remote add origin https://github.com/%GIT_USERNAME%/%GIT_REPO%.git
git branch -M main

echo.
echo 正在推送...
git push -u origin main

echo.
echo ============================
echo 推送完成！
echo ============================
echo.
echo 请打开 GitHub 仓库，进入 Actions 页面
echo 选择 "Build iOS IPA" 工作流并点击 "Run workflow"
echo 等待约10分钟后下载 IPA 文件
echo.
pause