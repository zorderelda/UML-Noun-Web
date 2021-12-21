from os import environ
from flask import current_app
from flask_wtf import FlaskForm
from wtforms import FileField
from flask_wtf.file import FileField, FileRequired, FileAllowed

# The Form class for my textfield
class UploadForm(FlaskForm):
    upload = FileField('Choose file', validators=[FileRequired()])