from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from app.utils import success_response, error_response
from app.middleware.auth_middleware import login_required
import re

user_bp = Blueprint('users', __name__)

def validate_user_data(data):
    errors = []
    
    name = data.get('name')
    age = data.get('age')
    email = data.get('email')
    
    if not name or len(name) < 1 or len(name) > 20:
        errors.append('姓名必须为1-20个字符')
    
    if age is not None:
        if not isinstance(age, int) or age < 18 or age > 60:
            errors.append('年龄必须为18-60的整数')
    
    if email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        errors.append('邮箱格式不正确')
    
    return errors

@user_bp.route('/', methods=['GET'])
@login_required
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify(success_response([user.to_dict() for user in users]))

@user_bp.route('/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(error_response(404, '员工不存在')), 404
    return jsonify(success_response(user.to_dict()))

@user_bp.route('/', methods=['POST'])
@login_required
def create_user():
    data = request.get_json()
    
    errors = validate_user_data(data)
    if errors:
        return jsonify(error_response(400, '参数校验失败：' + ', '.join(errors))), 400
    
    user = User(
        name=data['name'],
        age=data.get('age'),
        email=data.get('email')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(success_response(user.to_dict(), '创建成功'))

@user_bp.route('/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(error_response(404, '员工不存在')), 404
    
    data = request.get_json()
    
    errors = validate_user_data(data)
    if errors:
        return jsonify(error_response(400, '参数校验失败：' + ', '.join(errors))), 400
    
    if 'name' in data:
        user.name = data['name']
    if 'age' in data:
        user.age = data['age']
    if 'email' in data:
        user.email = data['email']
    
    db.session.commit()
    
    return jsonify(success_response(user.to_dict(), '修改成功'))

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify(error_response(404, '员工不存在')), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify(success_response(None, '删除成功'))