from flask import Flask
from flask_dotenv import DotEnv
from datetime import timedelta

# Check for stop words
try:
    from nltk.corpus import stopwords
    'test' in stopwords.words('english')
except:
    import nltk
    nltk.download('stopwords')

app = Flask(__name__)

# Local
from config import config
app.config.from_object(config['development'])

# Import the .env file
env = DotEnv()
env.init_app(app)

# Setup session stuff
app.permanent_session_lifetime = timedelta(minutes=5)

# register blueprint
from main import main
app.register_blueprint(main.bp)

# Register stuff
from main.main import sses, jwt
sses.init_app(app)
jwt.init_app(app)

@app.context_processor
def utility_jwt_encode():
    return dict(get_token=jwt.encode_jwt_token)