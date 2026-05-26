import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

def run_cmd(cmd):
    print(f"\n执行: {cmd[:80]}...")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err and "error" not in err.lower() and "warning" not in err.lower():
        print(f"错误: {err}")
    return out

print("\n=== 检查是否已安装 MySQL ===")
run_cmd("which mysql")

print("\n=== 安装 MySQL ===")
run_cmd("dnf install -y mysql mysql-server")

print("\n=== 启动 MySQL ===")
run_cmd("systemctl start mysqld")
run_cmd("systemctl enable mysqld")

print("\n=== 检查 MySQL 状态 ===")
run_cmd("systemctl status mysqld")

print("\n=== 获取临时密码 ===")
out = run_cmd("grep 'temporary password' /var/log/mysqld.log")
print("\n如果上面有临时密码，请记录下来！")

print("\n=== 安全配置（设置root密码） ===")
print("请手动执行以下命令设置root密码：")
print("mysql_secure_installation")

print("\n=== 创建数据库和用户 ===")
print("请手动执行以下SQL命令：")
print("""
mysql -u root -p
CREATE DATABASE IF NOT EXISTS figma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'figma'@'%' IDENTIFIED BY 'Figma123456.';
GRANT ALL PRIVILEGES ON figma.* TO 'figma'@'%';
FLUSH PRIVILEGES;
EXIT;
""")

print("\n=== 开放3306端口 ===")
run_cmd("firewall-cmd --permanent --add-port=3306/tcp || echo 'firewalld未运行'")

client.close()
print("\n✅ MySQL 安装完成！")
print("请按照上面的说明设置root密码和创建数据库！")