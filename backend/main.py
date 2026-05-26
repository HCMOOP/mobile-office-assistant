from app import app, db
from app.controllers.user_controller import user_bp
from app.controllers.auth_controller import auth_bp
from app.controllers.category_controller import category_bp
from app.controllers.device_controller import device_bp
from app.middleware.logging_middleware import logging_middleware
from app.middleware.exception_handler import register_exception_handlers

app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(category_bp, url_prefix='/api/categories')
app.register_blueprint(device_bp, url_prefix='/api/devices')

app.before_request(logging_middleware)
register_exception_handlers(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)