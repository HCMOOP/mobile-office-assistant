@echo off
cls
echo.
echo ================================
echo  一键部署 iOS 应用到 GitHub
echo ================================
echo.

:INPUT
set "GIT_USERNAME="
set "GIT_REPO="

set /p GIT_USERNAME=请输入你的 GitHub 用户名: 
if "%GIT_USERNAME%"=="" goto INPUT

set /p GIT_REPO=请输入你的仓库名:
if "%GIT_REPO%"=="" goto INPUT

echo.
echo ================================
echo 正在配置...
echo ================================
git config user.email "deploy@example.com"
git config user.name "%GIT_USERNAME%"

echo.
echo ================================
echo 正在添加文件...
echo ================================
git add .

echo.
echo ================================
echo 正在提交...
echo ================================
git commit -m "Build iOS IPA via GitHub Actions"

echo.
echo ================================
echo 正在设置远程仓库...
echo ================================
git remote remove origin 2>NUL
git remote add origin https://github.com/%GIT_USERNAME%/%GIT_REPO%.git
git branch -M main

echo.
echo ================================
echo 正在推送到 GitHub...
echo ================================
git push -u origin main

echo.
echo ================================
echo ✅ 推送成功！
echo ================================
echo.
echo 下一步操作：
echo 1. 打开 GitHub 仓库: https://github.com/%GIT_USERNAME%/%GIT_REPO%
echo 2. 点击顶部的 "Actions" 标签
echo 3. 选择 "Build iOS IPA" 工作流
echo 4. 点击 "Run workflow"
echo 5. 等待约 10 分钟
echo 6. 在工作流结果中下载 IPA 文件
echo.
echo 上传到 Appetize.io:
echo 1. 打开 https://appetize.io/
echo 2. 点击 "Upload App"
echo 3. 选择下载的 IPA 文件
echo.
pause