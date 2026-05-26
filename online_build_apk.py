import requests
import time

print("🎯 使用在线服务生成 APK...")
print("网站地址: http://101.201.173.122")

try:
    print("\n=== 第一步: 上传配置 ===")
    response = requests.post('https://apkzio.com/api/create', json={
        'url': 'http://101.201.173.122',
        'name': 'MobileOfficeAssistant',
        'package': 'com.office.assistant',
        'version': '1.0.0'
    })
    
    if response.status_code == 200:
        data = response.json()
        task_id = data.get('task_id')
        print(f"✅ 任务创建成功! Task ID: {task_id}")
        
        print("\n=== 第二步: 等待构建完成 ===")
        progress = 0
        while progress < 100:
            time.sleep(5)
            response = requests.get(f'https://apkzio.com/api/status/{task_id}')
            status = response.json()
            progress = status.get('progress', 0)
            print(f"进度: {progress}%")
            
            if status.get('status') == 'completed':
                download_url = status.get('download_url')
                print(f"\n🎉 构建完成!")
                print(f"下载地址: {download_url}")
                
                print("\n=== 第三步: 下载 APK ===")
                apk_response = requests.get(download_url)
                with open('MobileOfficeAssistant.apk', 'wb') as f:
                    f.write(apk_response.content)
                print("✅ APK 已保存到: MobileOfficeAssistant.apk")
                break
            
            elif status.get('status') == 'error':
                print(f"❌ 构建失败: {status.get('error')}")
                break
    else:
        print(f"❌ 创建任务失败: {response.text}")
        
except Exception as e:
    print(f"❌ 错误: {e}")
    print("\n📌 备用方案:")
    print("请手动访问 https://apkzio.com/")
    print("输入网址: http://101.201.173.122")
    print("点击 Build APK 按钮")
    print("等待生成后下载")