# Angular Django REST
An Angular\Django application with RESTful API and tests.

* Django REST framework - on 8001 port
* Angular node.js server - on 8002 port
* Karma phantomjs - on 8003 port

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

# Basic Setup

* Place settings_local.py in root folder
* Setup requiremenets and node_modules
* Run Django on 8001
* Run node.js server on 8002
