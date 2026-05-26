import paramiko

server = "101.201.173.122"
username = "root"
password = "Hyh262880."

print("连接服务器...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(server, username=username, password=password)

def run_cmd(cmd):
    print(f"\n执行: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print(f"错误: {err}")

print("=== 检查防火墙状态 ===")
run_cmd("systemctl status firewalld 2>/dev/null || systemctl status ufw 2>/dev/null || iptables -L -n")

print("\n=== 开放 80 端口 ===")
run_cmd("firewall-cmd --permanent --add-service=http 2>/dev/null || firewall-cmd --permanent --add-port=80/tcp")
run_cmd("firewall-cmd --reload 2>/dev/null || echo '可能没有 firewalld'")

print("\n=== 检查阿里云安全组 ===")
print("注意：如果还是无法访问，请检查阿里云控制台的安全组设置，确保 80 端口已开放！")

client.close()
print("\n✅ 配置完成！")