import logging, nltk
from flask import Flask
from flask_dotenv import DotEnv
from datetime import timedelta

app = Flask(__name__)

# Local
from config import config
#app.config.from_object(config['development'])
app.config.from_object(config['production'])

# Import the .env file
env = DotEnv()
env.init_app(app)

# Setup session stuff
app.permanent_session_lifetime = timedelta(minutes=5)

# Set jinja env stuff
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
app.jinja_env.auto_reload = True

# Set the datapath for nltk
nltk.data.path.append(app.config['NLTK_DOWNLOAD_DIR'])

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

if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

if __name__ == '__main__':
    app.run(port=8000, debug=True)