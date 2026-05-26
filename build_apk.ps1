$env:JAVA_HOME="C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:Path="$($env:JAVA_HOME)\bin;$env:Path"

Write-Host "Java版本:"
java -version

Write-Host ""
Write-Host "开始构建APK..."
npx cap build android

Write-Host ""
Write-Host "APK位置: android\app\build\outputs\apk\debug\app-debug.apk"