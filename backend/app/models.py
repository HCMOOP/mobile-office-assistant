from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer)
    email = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'email': self.email,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    devices = db.relationship('Device', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Device(db.Model):
    __tablename__ = 'devices'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id', ondelete='SET NULL'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'model': self.model,
            'category_id': self.category_id,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }