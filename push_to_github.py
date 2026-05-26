import subprocess
import os

def run_cmd(cmd, cwd=None):
    print(f"\n执行: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.stdout:
        print("输出:", result.stdout.strip())
    if result.stderr:
        print("错误:", result.stderr.strip())
    return result.returncode

os.chdir(r"C:\Users\hyh\Desktop\figma")

print("=== 配置 Git ===")
run_cmd(["git", "config", "user.email", "deploy@example.com"])
run_cmd(["git", "config", "user.name", "HCMOOP"])

print("\n=== 添加文件 ===")
run_cmd(["git", "add", "."])

print("\n=== 提交代码 ===")
run_cmd(["git", "commit", "-m", "Build iOS IPA"])

print("\n=== 推送到 GitHub ===")
run_cmd(["git", "push", "-u", "origin", "master"])

print("\n=== 完成 ===")
print("请刷新 GitHub 页面：https://github.com/HCMOOP/mobile-office-assistant")