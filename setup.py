import os, glob, venv
from pathlib import Path

# Get the project directory
project_path = Path.cwd()

# Find the python exec
python = glob.glob(str(project_path) + '/**/python', recursive=True)

# Check for venv
if not python:
    venv.create('venv')
    python = glob.glob(str(project_path) + '/**/python', recursive=True)


# Build the virtual env base directory
venv_path = project_path.joinpath(python[0]).parent.parent

# Make sure the uploads folder is there
uploads_path = project_path.joinpath('uploads')

# Create
uploads_path.mkdir(parents=True, exist_ok=True)

# Check for the .env file, if not there then write it
if not project_path.joinpath('.env').is_file():

    with open('.env', 'w') as f:
        f.write('FLASK_APP="uml"\n')
        f.write('UPLOADS_DIR="%s"\n' % str(uploads_path))
        f.write('SECRET_KEY="%s"\n' % os.urandom(64))

# Create the services folder
services_path = project_path.joinpath('services')

# Make it
services_path.mkdir(parents=True, exist_ok=True)

service = '''
[Unit]
Description=Flask Web Application Server using Gunicorn
After=network.target

[Service]
User=user
Group=user
WorkingDirectory="%PROJECTPATH%"
Environment="PATH=%VENVPATH%/bin"
ExecStart="%VENVPATH%/bin/gunicorn -w 3 --bind 127.0.0.1:8000 wsgi:app'
Restart=always

[Install]
WantedBy=multi-user.target
'''

ngix = '''
server {
	listen 80;
	server_name noun.fqdn.xyz;

    access_log /var/log/nginx/fqdn.access.log;
    error_log /var/log/nginx/fqdn.error.log;

    location / {
        proxy_pass http://127.0.0.1:8000;
        include proxy_params;
    }
}
'''

# Make the service file
service_file = services_path.joinpath('noun-web.service')
if not service_file.exists():
    with open(str(service_file), 'w') as f:
        f.write(service.replace('%PROJECTPATH%', str(project_path)).replace('%VENVPATH%', str(venv_path)))

# Make the conf file
service_file = services_path.joinpath('noun-web.nginx.conf')
if not service_file.exists():
    with open(str(service_file), 'w') as f:
        f.write(ngix)

# Create the path for nltk_data
data_path = venv_path.joinpath('lib', 'nltk_data')

# Make the nltk data directory
data_path.mkdir(parents=True, exist_ok=True)

# Get the packages required
import nltk
for down in ['stopwords', 'wordnet']:
    nltk.download(down, download_dir=str(data_path))

try:
    import tkinter as tk
    root = tk.Tk()
    root.title('ToDo')

    # Read the data to show
    text = open('todo.txt').read()

    # place a label on the root window
    message = tk.Label(root, text=text)
    message.pack()

    # keep the window displaying
    root.mainloop()

except:
    print('Ensure to run pip install -r requirements.txt')