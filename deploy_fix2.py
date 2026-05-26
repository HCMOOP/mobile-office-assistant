import paramiko
import os

server = "101.201.173.122"
username = "root"
password = "Hyh262880."
local_dist_path = "./dist"
deploy_path = "/var/www/office-app"

def ssh_exec(client, command):
    print(f"执行命令: {command}")
    stdin, stdout, stderr = client.exec_command(command)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print(f"错误: {err}")
    return out, err

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

print("\n=== 检查包管理器 ===")
ssh_exec(client, "which apt dnf yum")

print("\n=== 更新系统 ===")
ssh_exec(client, "apt update -y")

print("\n=== 安装 Nginx ===")
ssh_exec(client, "apt install -y nginx")

print("\n=== 启动 Nginx ===")
ssh_exec(client, "systemctl start nginx")
ssh_exec(client, "systemctl enable nginx")

print("\n=== 检查 Nginx 状态 ===")
ssh_exec(client, "systemctl status nginx")

print("\n=== 创建部署目录 ===")
ssh_exec(client, f"mkdir -p {deploy_path}")

print("\n=== 上传文件 ===")
sftp = client.open_sftp()
for root, dirs, files in os.walk(local_dist_path):
    for file in files:
        local_path = os.path.join(root, file)
        # 将 Windows 路径转换为 Linux 路径
        rel_path = os.path.relpath(local_path, local_dist_path).replace("\\", "/")
        remote_path = f"{deploy_path}/{rel_path}"
        # 创建目录
        remote_dir = os.path.dirname(remote_path)
        if remote_dir != deploy_path:
            ssh_exec(client, f"mkdir -p {remote_dir}")
        print(f"上传: {local_path} -> {remote_path}")
        sftp.put(local_path, remote_path)
sftp.close()

print("\n=== 配置 Nginx ===")
nginx_config = f"""server {{
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root {deploy_path};
    index index.html;
    location / {{
        try_files $uri $uri/ /index.html;
    }}
}}"""
ssh_exec(client, f"mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled")
ssh_exec(client, f"cat > /etc/nginx/sites-available/default << 'EOF'\n{nginx_config}\nEOF")
ssh_exec(client, "ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/")

print("\n=== 重启 Nginx ===")
ssh_exec(client, "systemctl restart nginx")

print("\n=== 检查端口 ===")
ssh_exec(client, "ss -tlnp")

client.close()
print("\n✅ 部署完成！")
print(f"访问地址: http://{server}")