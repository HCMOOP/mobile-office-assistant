import requests
import json

url = "https://api.github.com/repos/HCMOOP/mobile-office-assistant/actions/workflows/build-ios.yml/dispatches"

headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer YOUR_GITHUB_TOKEN",
    "X-GitHub-Api-Version": "2022-11-28"
}

data = {
    "ref": "main"
}

print("正在触发 GitHub Actions...")
print("请先在 GitHub 上创建一个 Personal Access Token")
print("并替换代码中的 YOUR_GITHUB_TOKEN")
print()
print("步骤：")
print("1. 打开 https://github.com/settings/tokens")
print("2. 点击 'Generate new token'")
print("3. 选择 'workflow' 权限")
print("4. 复制生成的 token")
print("5. 替换下面的 YOUR_GITHUB_TOKEN")
print()

# 如果有 token，取消注释下面的代码
# response = requests.post(url, headers=headers, data=json.dumps(data))
# if response.status_code == 204:
#     print("✅ 工作流已触发！")
# else:
#     print(f"❌ 失败: {response.text}")