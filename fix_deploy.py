import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)
sftp = client.open_sftp()

def run_cmd(cmd):
    print(f"执行: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err:
        print(f"错误: {err}")

print("=== 删除旧的 app.py ===")
run_cmd("rm -f /opt/figma-backend/app.py")

print("\n=== 上传新的 main.py ===")
sftp.put("c:\\Users\\hyh\\Desktop\\figma\\backend\\main.py", "/opt/figma-backend/main.py")

print("\n=== 启动服务 ===")
run_cmd("cd /opt/figma-backend && python main.py")

sftp.close()
client.close()