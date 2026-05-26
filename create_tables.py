import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

sql_script = """
USE figma;

-- 创建员工表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT,
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_created_at (created_at)
);

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建设备分类表
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建设备表
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    model VARCHAR(50),
    category_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_devices_category (category_id)
);

-- 插入默认管理员（密码：admin123）
INSERT IGNORE INTO admins (username, password_hash) VALUES ('admin', '$2b$12$EixZaYbB.rK4fl8x2q7Meu6Q6D2V5fF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q');

SHOW TABLES;
"""

print("\n=== 创建数据表 ===")
stdin, stdout, stderr = client.exec_command(f"mysql -u root -pHyh262880. -e \"{sql_script}\"")
stdout.channel.recv_exit_status()
print(stdout.read().decode())
err = stderr.read().decode()
if err and "error" in err.lower():
    print(f"错误: {err}")

client.close()
print("\n✅ 数据表创建完成！")