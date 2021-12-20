import os
from flask import Blueprint, current_app, send_from_directory
from flask_session import Session

from .security import JWT

# Create the blueprint
bp = Blueprint('main', __name__, template_folder="templates", static_folder="static", static_url_path='/main/static')

# Session
sses = Session()

# My JWT
jwt = JWT()

# Import our Routes
from .routes import *

# Standard Route to favicon
@bp.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(current_app.root_path, 'main/static/img'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')