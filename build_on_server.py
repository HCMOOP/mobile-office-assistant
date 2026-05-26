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

print("=== 检查服务器 Java ===")
run_cmd("java -version")

print("\n=== 上传前端构建产物 ===")
run_cmd("rm -rf /opt/figma/dist && mkdir -p /opt/figma/dist")

sftp = client.open_sftp()
def upload_dir(local_dir, remote_dir):
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = os.path.join(remote_dir, item)
        if os.path.isdir(local_path):
            sftp.mkdir(remote_path)
            upload_dir(local_path, remote_path)
        else:
            sftp.put(local_path, remote_path)
            print(f"上传: {item}")

upload_dir("c:\\Users\\hyh\\Desktop\\figma\\dist", "/opt/figma/dist")

print("\n=== 同步代码 ===")
run_cmd("cd /opt/figma && npx cap sync")

print("\n=== 构建 APK ===")
run_cmd("cd /opt/figma/android && ./gradlew assembleDebug", show_output=True)

print("\n=== 检查 APK ===")
run_cmd("ls -la /opt/figma/android/app/build/outputs/apk/debug/")

print("\n=== 下载 APK ===")
apk_remote = "/opt/figma/android/app/build/outputs/apk/debug/app-debug.apk"
apk_local = "c:\\Users\\hyh\\Desktop\\figma\\app-debug.apk"
try:
    sftp.get(apk_remote, apk_local)
    print(f"✅ APK 已下载到: {apk_local}")
except Exception as e:
    print(f"❌ 下载失败: {e}")

sftp.close()
client.close()
print("\n=== 完成 ===")