import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

print("检查 Nginx 状态...")
stdin, stdout, stderr = client.exec_command("systemctl status nginx")
print(stdout.read().decode())
print(stderr.read().decode())

print("\n检查防火墙...")
stdin, stdout, stderr = client.exec_command("ufw status")
print(stdout.read().decode())
print(stderr.read().decode())

print("\n检查 80 端口...")
stdin, stdout, stderr = client.exec_command("netstat -tlnp | grep 80")
print(stdout.read().decode())
print(stderr.read().decode())

client.close()