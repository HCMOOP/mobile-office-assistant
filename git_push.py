import subprocess
import os

os.chdir(r"C:\Users\hyh\Desktop\figma")

print("=== 配置 Git ===")
subprocess.run(["git", "config", "user.email", "deploy@example.com"], check=True)
subprocess.run(["git", "config", "user.name", "HCMOOP"], check=True)

print("\n=== 检查分支 ===")
result = subprocess.run(["git", "branch"], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)

print("\n=== 添加文件 ===")
subprocess.run(["git", "add", "."], check=True)

print("\n=== 提交 ===")
subprocess.run(["git", "commit", "-m", "Initial commit"], check=True)

print("\n=== 推送 ===")
subprocess.run(["git", "push", "-u", "origin", "master"], check=True)

print("\n✅ 推送成功！")
print("请刷新 GitHub 页面：https://github.com/HCMOOP/mobile-office-assistant")