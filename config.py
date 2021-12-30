from os import environ
from dotenv import load_dotenv

# Load the variables
load_dotenv()

class Config:
    
    SECRET_KEY = ":,)"
    CSRF_ENABLED = True
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    #UPLOAD_FOLDER = environ.get('UPLOAD_FOLDER') # Get from the .env
    ALLOWED_EXTENSIONS = ('txt', 'pdf', 'doc', 'docx', 'csv', 'epub', 'pptx', 'ppt', 'odt', 'rtf', 'xlsx', '', 'xls')
    

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
