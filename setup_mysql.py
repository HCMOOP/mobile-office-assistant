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
    if err and "error" not in err.lower():
        print(f"错误: {err}")
    return out

print("\n=== 设置 MySQL root 密码 ===")
# MySQL 8.0 需要使用 ALTER USER 命令
commands = [
    "mysql -u root -e \"ALTER USER 'root'@'localhost' IDENTIFIED BY 'Hyh262880.';\"",
    "mysql -u root -e \"CREATE DATABASE IF NOT EXISTS figma CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\"",
    "mysql -u root -e \"CREATE USER IF NOT EXISTS 'figma'@'%' IDENTIFIED BY 'Figma123456.';\"",
    "mysql -u root -e \"GRANT ALL PRIVILEGES ON figma.* TO 'figma'@'%';\"",
    "mysql -u root -e \"FLUSH PRIVILEGES;\"",
]

for cmd in commands:
    run_cmd(cmd)

print("\n=== 验证数据库创建 ===")
run_cmd("mysql -u root -pHyh262880. -e 'SHOW DATABASES;'")

print("\n=== 开放 3306 端口 ===")
print("请在阿里云控制台安全组中添加规则：")
print("- 端口范围：3306/3306")
print("- 授权对象：0.0.0.0/0")

client.close()
print("\n✅ MySQL 配置完成！")
print("\n📝 连接信息：")
print("  主机: 101.201.173.122")
print("  端口: 3306")
print("  数据库: figma")
print("  用户名: root")
print("  密码: Hyh262880.")
print("\n或者使用专用用户：")
print("  用户名: figma")
print("  密码: Figma123456.")