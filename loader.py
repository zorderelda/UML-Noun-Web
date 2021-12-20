import os
from flask import Flask
from datetime import timedelta
from dotenv import load_dotenv

def create_app():

    # Add the configuration from the dotenv
    APP_ROOT = os.path.join(os.path.dirname(__file__), '..')   # refers to application_top
    dotenv_path = os.path.join(APP_ROOT, '.flaskenv')
    load_dotenv(dotenv_path)

    app = Flask(__name__)

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

    return app

if __name__ == "__main__":
    create_app().run()