@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Java版本:
java -version

echo.
echo 开始构建APK...
npx cap build android

echo.
echo APK位置: android\app\build\outputs\apk\debug\app-debug.apk
pause