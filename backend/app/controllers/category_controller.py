from flask import Blueprint, request, jsonify
from app import db
from app.models import Category, Device
from app.utils import success_response, error_response
from app.middleware.auth_middleware import login_required

category_bp = Blueprint('categories', __name__)

@category_bp.route('/', methods=['GET'])
@login_required
def get_categories():
    categories = Category.query.all()
    result = []
    for category in categories:
        data = category.to_dict()
        data['device_count'] = Device.query.filter_by(category_id=category.id).count()
        result.append(data)
    return jsonify(success_response(result))

@category_bp.route('/<int:category_id>', methods=['GET'])
@login_required
def get_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(error_response(404, '分类不存在')), 404
    return jsonify(success_response(category.to_dict()))

@category_bp.route('/', methods=['POST'])
@login_required
def create_category():
    data = request.get_json()
    name = data.get('name')
    
    if not name or len(name) < 1 or len(name) > 20:
        return jsonify(error_response(400, '分类名称必须为1-20个字符')), 400
    
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    
    return jsonify(success_response(category.to_dict(), '创建成功'))

@category_bp.route('/<int:category_id>', methods=['PUT'])
@login_required
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(error_response(404, '分类不存在')), 404
    
    data = request.get_json()
    name = data.get('name')
    
    if not name or len(name) < 1 or len(name) > 20:
        return jsonify(error_response(400, '分类名称必须为1-20个字符')), 400
    
    category.name = name
    db.session.commit()
    
    return jsonify(success_response(category.to_dict(), '修改成功'))

@category_bp.route('/<int:category_id>', methods=['DELETE'])
@login_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(error_response(404, '分类不存在')), 404
    
    device_count = Device.query.filter_by(category_id=category_id).count()
    if device_count > 0:
        return jsonify(error_response(409, '分类下存在设备，无法删除')), 409
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify(success_response(None, '删除成功'))