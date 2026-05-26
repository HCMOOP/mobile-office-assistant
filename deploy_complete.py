import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."
deploy_path = "/var/www/office-app"

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

print("\n=== 创建部署目录 ===")
stdin, stdout, stderr = client.exec_command(f"mkdir -p {deploy_path}/assets")
stdout.channel.recv_exit_status()

print("\n=== 上传文件 ===")
sftp = client.open_sftp()
sftp.put("./dist/index.html", f"{deploy_path}/index.html")
sftp.put("./dist/assets/index-B_JF4yO3.js", f"{deploy_path}/assets/index-B_JF4yO3.js")
sftp.put("./dist/assets/index-DOTFRgFh.css", f"{deploy_path}/assets/index-DOTFRgFh.css")
sftp.close()
print("文件上传成功！")

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
stdin, stdout, stderr = client.exec_command(f"cat > /etc/nginx/conf.d/default.conf << 'EOF'\n{nginx_config}\nEOF")
stdout.channel.recv_exit_status()
print("配置完成！")

print("\n=== 重启 Nginx ===")
stdin, stdout, stderr = client.exec_command("systemctl restart nginx")
stdout.channel.recv_exit_status()
print("Nginx 重启成功！")

print("\n=== 检查端口 ===")
stdin, stdout, stderr = client.exec_command("ss -tlnp | grep nginx")
print(stdout.read().decode())

client.close()
print("\n✅ 部署完成！")
print(f"访问地址: http://{server}")