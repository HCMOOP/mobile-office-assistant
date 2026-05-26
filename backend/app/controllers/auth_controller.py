from flask import Blueprint, request, jsonify
from app import db
from app.models import Admin
from app.utils import generate_token, check_password, success_response, error_response

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify(error_response(400, '用户名和密码不能为空')), 400
    
    admin = Admin.query.filter_by(username=username).first()
    
    if not admin:
        return jsonify(error_response(401, '用户名或密码错误')), 401
    
    if not check_password(password, admin.password_hash):
        return jsonify(error_response(401, '用户名或密码错误')), 401
    
    token = generate_token(admin.id, admin.username)
    
    return jsonify(success_response({
        'token': token,
        'user': admin.to_dict()
    }, '登录成功'))