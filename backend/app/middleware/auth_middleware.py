from flask import request, jsonify
from app.utils import verify_token, error_response

def login_required(f):
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify(error_response(401, '未提供token')), 401
        
        if not token.startswith('Bearer '):
            return jsonify(error_response(401, 'token格式不正确')), 401
        
        token = token[7:]
        payload = verify_token(token)
        
        if not payload:
            return jsonify(error_response(401, 'token无效或已过期')), 401
        
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function