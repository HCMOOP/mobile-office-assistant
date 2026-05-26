import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

stdin, stdout, stderr = client.exec_command("mysql -u root -pHyh262880. -e 'SHOW DATABASES;'")
stdout.channel.recv_exit_status()
print(stdout.read().decode())

# 创建数据库（如果不存在）
stdin, stdout, stderr = client.exec_command("mysql -u root -pHyh262880. -e 'CREATE DATABASE IF NOT EXISTS figma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'")
stdout.channel.recv_exit_status()

# 验证
stdin, stdout, stderr = client.exec_command("mysql -u root -pHyh262880. -e 'USE figma; SHOW TABLES;'")
stdout.channel.recv_exit_status()
print("\n当前 figma 数据库的表：")
print(stdout.read().decode())

client.close()
print("\n✅ 数据库准备就绪！")