import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."
deploy_path = "/var/www/office-app"

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

def run_cmd(cmd):
    print(f"\n--- {cmd} ---")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    print(stderr.read().decode())

print("=== Nginx 状态 ===")
run_cmd("systemctl status nginx")

print("\n=== Nginx 配置 ===")
run_cmd("cat /etc/nginx/conf.d/default.conf")

print("\n=== 检查文件 ===")
run_cmd(f"ls -la {deploy_path}/")

print("\n=== 测试本地访问 ===")
run_cmd("curl localhost")

client.close()
print("\n✅ 检查完成")