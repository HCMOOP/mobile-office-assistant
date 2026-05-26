import paramiko
import os

server = "101.201.173.122"
username = "root"
password = "Hyh262880."
local_backend_path = "c:\\Users\\hyh\\Desktop\\figma\\backend"
remote_backend_path = "/opt/figma-backend"

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

sftp = client.open_sftp()

def run_cmd(cmd):
    print(f"\n执行: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print(f"错误: {err}")
    return out

def upload_dir(local_dir, remote_dir):
    print(f"\n上传目录: {local_dir} -> {remote_dir}")
    run_cmd(f"mkdir -p {remote_dir}")
    
    for item in os.listdir(local_dir):
        local_item = os.path.join(local_dir, item)
        remote_item = f"{remote_dir}/{item}"
        
        if os.path.isfile(local_item):
            print(f"  上传文件: {item}")
            sftp.put(local_item, remote_item)
        elif os.path.isdir(local_item):
            upload_dir(local_item, remote_item)

print("=== 上传后端代码 ===")
upload_dir(local_backend_path, remote_backend_path)

print("\n=== 安装 Python 依赖 ===")
run_cmd(f"pip install -r {remote_backend_path}/requirements.txt")

print("\n=== 安装 PyMySQL ===")
run_cmd("pip install pymysql")

print("\n=== 启动后端服务 ===")
run_cmd(f"cd {remote_backend_path} && python app.py")

sftp.close()
client.close()
print("\n✅ 后端部署完成！")