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

print(f"\n更新管理员密码...")
cmd = f"mysql -u root -pHyh262880. -e \"USE figma; UPDATE admins SET password_hash = '{hashed_password}' WHERE username = 'admin';\""
stdin, stdout, stderr = client.exec_command(cmd)
stdout.channel.recv_exit_status()
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print(f"错误: {err}")

client.close()
print("\n✅ 管理员密码已更新！")