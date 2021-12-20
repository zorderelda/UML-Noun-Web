from flask_wtf import FlaskForm
from wtforms import Form, FileField
from flask_wtf.file import FileField, FileRequired, FileAllowed

# The Form class for my textfield
class UploadForm(FlaskForm):
    upload = FileField('Choose file', validators=[FileRequired(), FileAllowed(['txt'], 'Text Files Only!')])