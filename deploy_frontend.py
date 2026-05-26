import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

def run_cmd(cmd):
    print(f"\n执行: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    if out:
        print(out)
    err = stderr.read().decode()
    if err:
        print(f"错误: {err}")

print("=== 删除旧文件 ===")
run_cmd("rm -rf /usr/share/nginx/html/*")

print("\n=== 上传新文件 ===")
sftp = client.open_sftp()
sftp.put("c:\\Users\\hyh\\Desktop\\figma\\dist\\index.html", "/usr/share/nginx/html/index.html")

def upload_dir(local_dir, remote_dir):
    run_cmd(f"mkdir -p {remote_dir}")
    import os
    for item in os.listdir(local_dir):
        local_item = os.path.join(local_dir, item)
        remote_item = f"{remote_dir}/{item}"
        if os.path.isfile(local_item):
            sftp.put(local_item, remote_item)
        elif os.path.isdir(local_item):
            upload_dir(local_item, remote_item)

upload_dir("c:\\Users\\hyh\\Desktop\\figma\\dist\\assets", "/usr/share/nginx/html/assets")

sftp.close()

print("\n=== 重启 Nginx ===")
run_cmd("systemctl restart nginx")

client.close()
print("\n✅ 前端部署完成！")
print("访问地址: http://101.201.173.122")