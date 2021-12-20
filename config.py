
from flask_dotenv import DotEnv

class Config:
    
    SECRET_KEY = ":,)"
    CSRF_ENABLED = True
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    

class DevelopmentConfig(Config):
    ENV = "development"
    DEBUG = True
    TESTING = True

class ProductionConfig(Config):
    ENV = "production"
    DEBUG = False
    TESTING = False
    
# How to access from external
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
