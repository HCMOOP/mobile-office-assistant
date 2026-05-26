import paramiko
import os

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

def run_cmd(cmd, show_output=True):
    print(f"\n执行: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    if show_output:
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out:
            print(out)
        if err:
            print(f"错误: {err}")

print("=== 检查 Java 版本 ===")
run_cmd("java -version")

print("\n=== 检查 Gradle 版本 ===")
run_cmd("gradle --version")

print("\n=== 同步代码到 Android ===")
run_cmd("cd /opt/figma && npx cap sync")

print("\n=== 构建 APK ===")
run_cmd("cd /opt/figma/android && ./gradlew assembleDebug", show_output=True)

print("\n=== 检查 APK 文件 ===")
run_cmd("ls -la /opt/figma/android/app/build/outputs/apk/debug/")

print("\n=== 下载 APK ===")
sftp = client.open_sftp()
apk_remote_path = "/opt/figma/android/app/build/outputs/apk/debug/app-debug.apk"
apk_local_path = "c:\\Users\\hyh\\Desktop\\figma\\app-debug.apk"

try:
    sftp.get(apk_remote_path, apk_local_path)
    print(f"✅ APK 已下载到: {apk_local_path}")
except Exception as e:
    print(f"❌ 下载失败: {e}")

sftp.close()
client.close()

print("\n=== 构建完成 ===")
print(f"APK 文件位置: {apk_local_path}")