import paramiko
import os

server = "101.201.173.122"
username = "root"
password = "Hyh262880."
local_dist_path = "./dist"
remote_dist_path = "/tmp/dist"
deploy_path = "/var/www/office-app"

def ssh_exec(client, command):
    stdin, stdout, stderr = client.exec_command(command)
    stdout.channel.recv_exit_status()
    return stdout.read().decode(), stderr.read().decode()

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

print("更新系统...")
ssh_exec(client, "apt-get update -y")

print("安装 Nginx...")
ssh_exec(client, "apt-get install -y nginx")

print("停止 Nginx...")
ssh_exec(client, "systemctl stop nginx")

print("创建部署目录...")
ssh_exec(client, f"mkdir -p {deploy_path} {remote_dist_path}")

print("上传文件...")
sftp = client.open_sftp()
for root, dirs, files in os.walk(local_dist_path):
    for file in files:
        local_path = os.path.join(root, file)
        remote_path = os.path.join(remote_dist_path, os.path.relpath(local_path, local_dist_path))
        try:
            sftp.mkdir(os.path.dirname(remote_path))
        except:
            pass
        sftp.put(local_path, remote_path)
sftp.close()

print("复制文件到部署目录...")
ssh_exec(client, f"cp -r {remote_dist_path}/* {deploy_path}/")

print("配置 Nginx...")
nginx_config = f"""server {{
    listen 80;
    server_name {server};
    root {deploy_path};
    index index.html;
    location / {{
        try_files $uri $uri/ /index.html;
    }}
}}"""
ssh_exec(client, f"echo '{nginx_config}' > /etc/nginx/sites-available/office-app")
ssh_exec(client, "ln -sf /etc/nginx/sites-available/office-app /etc/nginx/sites-enabled/")
ssh_exec(client, "rm -f /etc/nginx/sites-enabled/default")

print("重启 Nginx...")
ssh_exec(client, "systemctl start nginx")

client.close()
print("\n部署完成！")
print(f"访问地址: http://{server}")