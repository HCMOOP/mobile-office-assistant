from flask import Blueprint, request, jsonify
from app import db
from app.models import Device, Category
from app.utils import success_response, error_response
from app.middleware.auth_middleware import login_required

device_bp = Blueprint('devices', __name__)

@device_bp.route('/', methods=['GET'])
@login_required
def get_devices():
    category_id = request.args.get('category_id')
    if category_id:
        devices = Device.query.filter_by(category_id=category_id).all()
    else:
        devices = Device.query.all()
    return jsonify(success_response([device.to_dict() for device in devices]))

@device_bp.route('/<int:device_id>', methods=['GET'])
@login_required
def get_device(device_id):
    device = Device.query.get(device_id)
    if not device:
        return jsonify(error_response(404, '设备不存在')), 404
    return jsonify(success_response(device.to_dict()))

@device_bp.route('/', methods=['POST'])
@login_required
def create_device():
    data = request.get_json()
    name = data.get('name')
    model = data.get('model')
    category_id = data.get('category_id')
    
    if not name:
        return jsonify(error_response(400, '设备名称不能为空')), 400
    
    if category_id:
        category = Category.query.get(category_id)
        if not category:
            return jsonify(error_response(400, '分类不存在')), 400
    
    device = Device(
        name=name,
        model=model,
        category_id=category_id
    )
    
    db.session.add(device)
    db.session.commit()
    
    return jsonify(success_response(device.to_dict(), '创建成功'))

@device_bp.route('/<int:device_id>', methods=['PUT'])
@login_required
def update_device(device_id):
    device = Device.query.get(device_id)
    if not device:
        return jsonify(error_response(404, '设备不存在')), 404
    
    data = request.get_json()
    
    if 'name' in data:
        if not data['name']:
            return jsonify(error_response(400, '设备名称不能为空')), 400
        device.name = data['name']
    
    if 'model' in data:
        device.model = data['model']
    
    if 'category_id' in data:
        category_id = data['category_id']
        if category_id:
            category = Category.query.get(category_id)
            if not category:
                return jsonify(error_response(400, '分类不存在')), 400
        device.category_id = category_id
    
    db.session.commit()
    
    return jsonify(success_response(device.to_dict(), '修改成功'))

@device_bp.route('/<int:device_id>', methods=['DELETE'])
@login_required
def delete_device(device_id):
    device = Device.query.get(device_id)
    if not device:
        return jsonify(error_response(404, '设备不存在')), 404
    
    db.session.delete(device)
    db.session.commit()
    
    return jsonify(success_response(None, '删除成功'))

@device_bp.route('/category/<int:category_id>', methods=['GET'])
@login_required
def get_devices_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(error_response(404, '分类不存在')), 404
    
    devices = Device.query.filter_by(category_id=category_id).all()
    return jsonify(success_response([device.to_dict() for device in devices]))