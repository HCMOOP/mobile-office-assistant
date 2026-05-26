import paramiko
import bcrypt

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

hashed_password = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode('utf-8')
print(f"哈希密码: {hashed_password}")

print("\n连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

print("\n创建 SQL 文件...")
sql_content = f"""USE figma;
DELETE FROM admins WHERE username = 'admin';
INSERT INTO admins (username, password_hash) VALUES ('admin', '{hashed_password}');
SELECT * FROM admins;
"""
sftp = client.open_sftp()
with sftp.open('/tmp/fix_admin.sql', 'w') as f:
    f.write(sql_content)
sftp.close()

print("\n执行 SQL...")
cmd = "mysql -u root -pHyh262880. < /tmp/fix_admin.sql"
stdin, stdout, stderr = client.exec_command(cmd)
stdout.channel.recv_exit_status()
print(stdout.read().decode())

client.close()
print("\n✅ 管理员已修复！")