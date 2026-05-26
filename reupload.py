import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)
sftp = client.open_sftp()

print("上传 __init__.py")
sftp.put("c:\\Users\\hyh\\Desktop\\figma\\backend\\app\\__init__.py", "/opt/figma-backend/app/__init__.py")

print("上传 main.py")
sftp.put("c:\\Users\\hyh\\Desktop\\figma\\backend\\main.py", "/opt/figma-backend/main.py")

print("上传 config.py")
sftp.put("c:\\Users\\hyh\\Desktop\\figma\\backend\\config.py", "/opt/figma-backend/config.py")

sftp.close()

print("\n=== 启动服务 ===")
stdin, stdout, stderr = client.exec_command("cd /opt/figma-backend && python main.py")
import time
time.sleep(5)
print(stdout.read().decode())
print(stderr.read().decode())

client.close()