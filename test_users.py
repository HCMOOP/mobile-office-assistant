import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzc5Njk4MzEwfQ.-9nvX_qngsiVINI0FMdPAF7fhClcYZd_G3jtosg2O-s'

headers = {'Authorization': f'Bearer {token}'}

try:
    print("=== 获取用户列表 ===")
    response = requests.get('http://101.201.173.122:5000/api/users', headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}\n")

    print("=== 创建用户 ===")
    response = requests.post('http://101.201.173.122:5000/api/users', headers=headers, json={
        'name': '张三',
        'age': 25,
        'email': 'zhangsan@example.com'
    })
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}\n")

    print("=== 再次获取用户列表 ===")
    response = requests.get('http://101.201.173.122:5000/api/users', headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")
except Exception as e:
    print(f"错误: {e}")