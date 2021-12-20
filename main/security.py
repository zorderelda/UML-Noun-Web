import jwt
import datetime
from flask import session, request
from datetime import datetime, timedelta

class JWT():

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.__app = app

    def init_app(self, app):
        self.secret = app.config.get('SECRET_KEY')

    def encode_jwt_token(self):
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=0, minutes=5),
                'iat': datetime.utcnow(),
                'sub': session.sid
            }
            return jwt.encode(
                payload,
                self.secret,
                algorithm='HS256'
            )
        except Exception:
            return ''

    def decode_jwt_token(self, auth_token):
        
        try:
            payload = jwt.decode(auth_token, self.secret, algorithms=["HS256"])
            return payload['sub']

        except jwt.ExpiredSignatureError as e:
            print(e)
            return False