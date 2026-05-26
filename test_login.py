import requests

try:
    response = requests.post('http://101.201.173.122:5000/api/auth/login', json={
        'username': 'admin',
        'password': 'admin123'
    })
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")
except Exception as e:
    print(f"连接失败: {e}")