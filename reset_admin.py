import paramiko
import bcrypt

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

hashed_password = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode('utf-8')

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

print("\n删除旧管理员...")
cmd1 = "mysql -u root -pHyh262880. -e \"USE figma; DELETE FROM admins WHERE username = 'admin';\""
stdin, stdout, stderr = client.exec_command(cmd1)
stdout.channel.recv_exit_status()

print("\n插入新管理员...")
cmd2 = f"mysql -u root -pHyh262880. -e \"USE figma; INSERT INTO admins (username, password_hash) VALUES ('admin', '{hashed_password}');\""
stdin, stdout, stderr = client.exec_command(cmd2)
stdout.channel.recv_exit_status()

print("\n验证...")
cmd3 = "mysql -u root -pHyh262880. -e \"USE figma; SELECT * FROM admins;\""
stdin, stdout, stderr = client.exec_command(cmd3)
stdout.channel.recv_exit_status()
print(stdout.read().decode())

client.close()
print("\n✅ 管理员已重置！")