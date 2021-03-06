import logging, tempfile, pathlib
from flask import current_app, render_template, request, session, flash, jsonify, url_for, redirect, send_from_directory, abort
from werkzeug.utils import secure_filename

# From our Blueprints
from ..main import bp, jwt
from ..forms import UploadForm
from ..functions.process import ProcessFile, WritePageDocx, WriteTableExcel, ExtractText

# Create a default route
@bp.route("/")
def index():

    # Form to use in the standad
    form = UploadForm()

    # CSP Stuff
    #nonce = base64.b64encode(os.urandom(64)).decode('utf8')
    #default_http_header = {'Content-Security-Policy': f"default-src 'self'; script-src 'self' 'nonce-{nonce}'" }

    return render_template('index.html', form = form)#, nonce = nonce), 200, default_http_header

# Create a compiled route
@bp.route("/compile", methods=['POST'])
def compile():

    # Form to use in the standad
    form = UploadForm()
    current_app.logger.debug('Compile Called')

    # Delete the session variables if there
    if 'lines' in session:
        del session['lines']

    if 'nouns' in session:
        del session['nouns']
    
    if form.validate_on_submit():

        # Get uploaded file data and save it
        f = form.upload.data
        sfilename = secure_filename(f.filename)
        file_path = pathlib.Path(current_app.config['UPLOADS_DIR']).joinpath(sfilename)
        f.save(str(file_path))

        # Assign to path
        ext = file_path.suffix.lower().replace('.', '')

        # Make sure there is a suffix
        if ext:
           
            # Check filenames
            if ext in current_app.config['ALLOWED_EXTENSIONS']:

                # Do log
                current_app.logger.debug("File: %s" % str(file_path))

                # Extract the text from it
                sfilename = ExtractText(str(file_path))

                # Do log
                current_app.logger.debug("File Extracted")
                
                # Store in the session the Processed file
                session['lines'], session['nouns'] = ProcessFile(sfilename)

                # Do Log
                current_app.logger.debug("Completed Compile")

                return jsonify({ 'completed': True })

    current_app.logger.debug("Something went bad")

    # Tell user something wrong
    flash('Something wrong with file, please try again')

    # Refresh
    return redirect(url_for('main.index'))
    
# Create a compiled route
@bp.route("/get")
def get():

    if 'lines' not in session and 'nouns' not in session:

        # Tell user to upload a file!
        flash('Please select a file first')

        # Refresh
        return redirect(url_for('main.index'))

    # Get the data
    data = request.args
    if 'value' in data and 'token' in data:

        token = request.args.get('token')

        # Verify the JWT token
        if jwt.decode_jwt_token(token) != session.sid:

            # Clear session
            session.clear()

            # Tell user to upload a file!
            flash('Token Expired, refreshing page, please upload again')

            # Refresh
            return redirect(url_for('main.index'))

        # Get which template to get
        which = request.args.get('value')

        # Compile the data here
        return render_template("paperview.html", lines=session['lines']) if which == 'paperview' else  render_template("tableview.html", nouns=session['nouns'])

    # Retrun failure
    return jsonify({ 'completed': False })

# Create a compiled route
@bp.route("/download")
def download():

    if 'lines' not in session and 'nouns' not in session:

        # Tell user to upload a file!
        flash('Please select a file first')

        # Return data completed
        return jsonify({'completed': False})

    # Get the params
    which = request.args.get('which')
    
    # Get the jwt
    token = request.args.get('jwt')

    # Confirm
    if which is None or token is None:
        
        # Refresh
        return redirect(url_for('main.index'))

    # Verify the JWT token
    if jwt.decode_jwt_token(token) != session.sid:

        # Tell user to upload a file!
        flash('Refreshing page, please upload again')

        # Clear session
        session.clear()

        # Refresh
        return redirect(url_for('main.index'))

    try:
        if which == 'paperview':
            # Create the temp file
            temp = tempfile.NamedTemporaryFile(suffix='.docx')
            pt = pathlib.Path(temp.name)
            WritePageDocx(temp, session['lines'])
            return send_from_directory(directory=pt.parent, path=pt.name, as_attachment=True)

        elif which == 'tableview':
            # Create the temp file
            temp = tempfile.NamedTemporaryFile(suffix='.xlsx')
            pt = pathlib.Path(temp.name)
            WriteTableExcel(temp, session['nouns'])
            return send_from_directory(directory=pt.parent, path=pt.name, as_attachment=True)
        
    except FileNotFoundError:

        # Tell user something wrong
        flash('File creation failed, please try again')

        # Refresh
        return redirect(url_for('main.index'))
