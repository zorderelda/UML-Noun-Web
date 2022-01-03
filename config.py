from os import environ

class Config:
    
    SECRET_KEY = ":,)"
    CSRF_ENABLED = True
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    ALLOWED_EXTENSIONS = ('txt', 'pdf', 'doc', 'docx', 'csv', 'epub', 'pptx', 'ppt', 'odt', 'rtf', 'xlsx', '', 'xls', 'html', 'htm')
    

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
