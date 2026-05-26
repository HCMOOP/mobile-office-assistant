import paramiko
import os

server = "101.201.173.122"
username = "root"
password = "Hyh262880."
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

print("\n=== 更新系统 ===")
ssh_exec(client, "dnf update -y")

print("\n=== 安装 Nginx ===")
ssh_exec(client, "dnf install -y nginx")

print("\n=== 启动 Nginx ===")
ssh_exec(client, "systemctl start nginx")
ssh_exec(client, "systemctl enable nginx")

print("\n=== 检查 Nginx 状态 ===")
ssh_exec(client, "systemctl status nginx")

print("\n=== 上传文件 ===")
sftp = client.open_sftp()
sftp.put("./dist/index.html", f"{deploy_path}/index.html")
sftp.mkdir(f"{deploy_path}/assets", ignore_existing=True)
sftp.put("./dist/assets/index-B_JF4yO3.js", f"{deploy_path}/assets/index-B_JF4yO3.js")
sftp.put("./dist/assets/index-DOTFRgFh.css", f"{deploy_path}/assets/index-DOTFRgFh.css")
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
ssh_exec(client, f"cat > /etc/nginx/conf.d/default.conf << 'EOF'\n{nginx_config}\nEOF")

print("\n=== 重启 Nginx ===")
ssh_exec(client, "systemctl restart nginx")

print("\n=== 检查端口 ===")
ssh_exec(client, "ss -tlnp")

client.close()
print("\n✅ 部署完成！")
print(f"访问地址: http://{server}")