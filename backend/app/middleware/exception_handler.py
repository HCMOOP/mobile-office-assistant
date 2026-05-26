from flask import jsonify
from app.utils import error_response
import traceback

def register_exception_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify(error_response(400, '请求参数错误')), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify(error_response(401, '未授权访问')), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify(error_response(403, '禁止访问')), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify(error_response(404, '资源未找到')), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        traceback.print_exc()
        return jsonify(error_response(500, '服务器内部错误')), 500
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        traceback.print_exc()
        return jsonify(error_response(500, str(error))), 500