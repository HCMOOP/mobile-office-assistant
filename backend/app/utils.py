import jwt
import bcrypt
from datetime import datetime, timedelta
from config import Config

def generate_token(user_id, username):
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRE_HOURS)
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def success_response(data=None, message='成功'):
    return {
        'code': 200,
        'message': message,
        'data': data
    }

def error_response(code, message):
    return {
        'code': code,
        'message': message,
        'data': None
    }