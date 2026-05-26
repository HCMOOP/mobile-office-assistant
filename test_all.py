import requests

BASE_URL = 'http://101.201.173.122:5000/api'
token = None

def test_login():
    print("=== 测试登录接口 ===")
    global token
    try:
        response = requests.post(f'{BASE_URL}/auth/login', json={
            'username': 'admin',
            'password': 'admin123'
        })
        print(f"状态码: {response.status_code}")
        result = response.json()
        print(f"响应: {result}")
        if result.get('code') == 200:
            token = result['data']['token']
            print("✅ 登录成功！")
        return True
    except Exception as e:
        print(f"❌ 登录失败: {e}")
        return False

def test_users():
    print("\n=== 测试用户管理接口 ===")
    if not token:
        print("❌ 请先登录")
        return
    
    # 获取用户列表
    print("\n1. 获取用户列表")
    response = requests.get(f'{BASE_URL}/users', headers={'Authorization': f'Bearer {token}'})
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 创建用户
    print("\n2. 创建用户")
    response = requests.post(f'{BASE_URL}/users', headers={'Authorization': f'Bearer {token}'}, json={
        'name': '测试用户',
        'age': 30,
        'email': 'test@example.com'
    })
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"响应: {result}")
    user_id = result['data']['id'] if result.get('code') == 200 else None
    
    # 更新用户
    if user_id:
        print("\n3. 更新用户")
        response = requests.put(f'{BASE_URL}/users/{user_id}', headers={'Authorization': f'Bearer {token}'}, json={
            'name': '测试用户_修改',
            'age': 31
        })
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
    
    # 删除用户
    if user_id:
        print("\n4. 删除用户")
        response = requests.delete(f'{BASE_URL}/users/{user_id}', headers={'Authorization': f'Bearer {token}'})
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")

def test_categories():
    print("\n=== 测试设备分类接口 ===")
    if not token:
        print("❌ 请先登录")
        return
    
    # 获取分类列表
    print("\n1. 获取分类列表")
    response = requests.get(f'{BASE_URL}/categories', headers={'Authorization': f'Bearer {token}'})
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 创建分类
    print("\n2. 创建分类")
    response = requests.post(f'{BASE_URL}/categories', headers={'Authorization': f'Bearer {token}'}, json={
        'name': '测试分类'
    })
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"响应: {result}")
    category_id = result['data']['id'] if result.get('code') == 200 else None
    
    # 删除分类
    if category_id:
        print("\n3. 删除分类")
        response = requests.delete(f'{BASE_URL}/categories/{category_id}', headers={'Authorization': f'Bearer {token}'})
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")

def test_devices():
    print("\n=== 测试设备管理接口 ===")
    if not token:
        print("❌ 请先登录")
        return
    
    # 获取设备列表
    print("\n1. 获取设备列表")
    response = requests.get(f'{BASE_URL}/devices', headers={'Authorization': f'Bearer {token}'})
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")

def test_frontend():
    print("\n=== 测试前端页面 ===")
    try:
        response = requests.get('http://101.201.173.122')
        print(f"状态码: {response.status_code}")
        if response.status_code == 200:
            print("✅ 前端页面可访问！")
        else:
            print("❌ 前端页面访问失败")
    except Exception as e:
        print(f"❌ 前端访问失败: {e}")

if __name__ == '__main__':
    print("="*60)
    print("🎯 开始测试 Mobile Office Assistant 项目")
    print("="*60)
    
    # 测试顺序
    test_frontend()
    login_success = test_login()
    
    if login_success:
        test_users()
        test_categories()
        test_devices()
    
    print("\n" + "="*60)
    print("🎉 测试完成！")
    print("="*60)