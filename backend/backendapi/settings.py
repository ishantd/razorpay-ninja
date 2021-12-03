import os
import json
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured

SETTINGS_DIR = Path(__file__).resolve().parent
BASE_DIR = Path(__file__).resolve().parent.parent

try:
    with open(os.path.join(SETTINGS_DIR, 'creds/config.json')) as f:
        configs = json.loads(f.read())
except:
    configs = None
    print("Couldn't Find config file")
    
def get_env_var(setting, configs=configs):
 try:
     val = configs[setting]
     if val == 'True':
         val = True
     elif val == 'False':
         val = False
     return val
 except KeyError:
     error_msg = "ImproperlyConfigured: Set {0} environment variable".format(setting)
     raise ImproperlyConfigured(error_msg)
 except Exception as e:
     print ("some unexpected error occurred!", e)
    
SECRET_KEY = 'django-insecure-u04vmfejq)zudsnik95^ot!#4^8aj*r(q$6g3@tmtf1#2*p%3e'

SECRET_KEY = get_env_var("SECRET_KEY")

DEBUG = get_env_var("DEBUG")

ALLOWED_HOSTS = get_env_var("ALLOWED_HOSTS")

EMAIL_CONFIG = get_env_var("EMAIL")

GOOGLE = get_env_var("GOOGLE")

RAZORPAY = get_env_var("razorpay")

DB_CONFIG = get_env_var("DB")

AWS = get_env_var("AWS")

SEND_OTP = get_env_var("SEND_OTP")

SEND_EMAIL = get_env_var("SEND_EMAIL")

SEND_ERRORS_TO_SENTRY = get_env_var("SEND_ERRORS_TO_SENTRY")

if SEND_ERRORS_TO_SENTRY:
    sentry_sdk.init(
        dsn="https://f32a6be9ba604662ae5e7d617a3eacde@o1082572.ingest.sentry.io/6091252",
        integrations=[DjangoIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,

        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True
    )


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    # Authentication apps
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth.registration',
    
    # Extra Apps
    'drf_yasg',
    'corsheaders',
    
    # Project Apps
    'accounts',
]


SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backendapi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backendapi.wsgi.application'

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", DB_CONFIG["ENGINE"]),
        "NAME": os.environ.get("SQL_DATABASE", DB_CONFIG["NAME"]),
        "USER": os.environ.get("SQL_USER", DB_CONFIG["USER"]),
        "PASSWORD": os.environ.get("SQL_PASSWORD", DB_CONFIG["PASSWORD"]),
        "HOST": os.environ.get("SQL_HOST", DB_CONFIG["HOST"]),
        "PORT": os.environ.get("SQL_PORT", DB_CONFIG["PORT"]),
    }
}

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ]
}



LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOGIN_URL = '/admin/login/'

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

AWS_ACCESS_KEY_ID = AWS["SES"]["ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = AWS["SES"]["ACCESS_KEY_SECRET"]
AWS_SNS_ACCESS_KEY_ID = AWS["SNS"]["ACCESS_KEY_ID"]
AWS_SNS_SECRET_ACCESS_KEY = AWS["SNS"]["ACCESS_KEY_SECRET"]
AWS_SES_REGION_NAME = 'ap-south-1'
AWS_DEFAULT_REGION_NAME = 'ap-south-1'
AWS_SES_REGION_ENDPOINT = 'email.ap-south-1.amazonaws.com'

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "none"

EMAIL_BACKEND = 'django_ses.SESBackend'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id':  GOOGLE['id'],
            'secret': GOOGLE['secret'],
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'offline',
        }
    }
}

RAZORPAY_X_KEY = RAZORPAY["x"]["key"]
RAZORPAY_X_SECRET = RAZORPAY["x"]["secret"]

RAZORPAY_KEY = RAZORPAY["normal"]["key"]
RAZORPAY_SECRET = RAZORPAY["normal"]["secret"]

RAZORPAY_ACCOUNT_NUMBER = RAZORPAY["account"]