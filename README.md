# AngularJs Django REST
An AngularJs\Django application with RESTful API, tests, bootstrap and a bit Node.Js.

# Versions
* Django 1.9.6
* AngularJs 1.5.5

# Ports
* Django REST framework - on 8001 port.
* AngularJs comes with Node.Js server - on 8002 port.
* Karma phantomjs for testing - on 8003 port.

# Setup

Clone this repository locally.

### Django
1. Make virtualenv for Django.
2. In the root of the project run command `pip install -r requirements.txt`
3. Edit and put "settings_local.py"* in the root of the project.
4. To start server run command `./manage.py runserver 8002`
5. Tests run command `coverage run --source='.' manage.py`
6. Tests output html command - `coverage html --include=‘app/api/*’ --omit='*migrations*,*tests*'`

### AngularJs + Node.Js
1. Go to the "node_server" folder.
2. In the root of the folder 'node_server' setup Node.Js dependencies `npm install`
3. To start server run command `node app.js`
4. To start tests run command `$PATH_TO_THE_PROJECT/node_server/node_modules/karma/bin/karma start` or `karma start` if Karma installed globally.

Open http://127.0.0.1:8001/

# settings_local.py - for Django Application

    # -*- coding: utf8 -*-
    import os
    
    DEBUG = True
    ALLOWED_HOSTS = ['*']
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    if DEBUG:
        CACHES = {
            'default': {
                'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
           }
        }
        EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    else:
        EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
        
        EMAIL_USE_TLS = True
        EMAIL_HOST = ''
        EMAIL_PORT = 0
        EMAIL_HOST_USER = ''
        EMAIL_HOST_PASSWORD = ''
    
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': '',
            'USER': '',
            'PASSWORD': '',
            'HOST': '',
            'PORT': '',
        }
    }
