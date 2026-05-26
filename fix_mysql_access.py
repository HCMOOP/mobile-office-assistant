import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

commands = [
    "mysql -u root -pHyh262880. -e \"CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'Hyh262880.';\"",
    "mysql -u root -pHyh262880. -e \"GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';\"",
    "mysql -u root -pHyh262880. -e \"FLUSH PRIVILEGES;\"",
    "mysql -u root -pHyh262880. -e \"SELECT User, Host FROM mysql.user;\""
]

for cmd in commands:
    print(f"\n执行: {cmd[:60]}...")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode())

client.close()
print("\n✅ MySQL 远程访问已配置！")