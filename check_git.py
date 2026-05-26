import subprocess
import os

os.chdir(r"C:\Users\hyh\Desktop\figma")

print("=== Git 状态 ===")
result = subprocess.run(["git", "status"], capture_output=True, text=True)
print("stdout:", result.stdout)
print("stderr:", result.stderr)

print("\n=== Git 日志 ===")
result = subprocess.run(["git", "log", "--oneline", "-1"], capture_output=True, text=True)
print("stdout:", result.stdout)
print("stderr:", result.stderr)

print("\n=== Git 远程 ===")
result = subprocess.run(["git", "remote", "-v"], capture_output=True, text=True)
print("stdout:", result.stdout)
print("stderr:", result.stderr)