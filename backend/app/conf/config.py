import os
from dotenv import load_dotenv
import logging

from app.common.error import InternalError

load_dotenv()


class Config:
    version = "0.1.0"
    title = "releads"

    # Full Atlas-style URI. When set, mongodb_url/db_username/db_password are
    # not required because credentials are embedded in the URI.
    mongo_uri: str = os.getenv('MONGO_URI', '')

    app_settings = {
        'db_name': os.getenv('MONGO_DB'),
        'mongodb_url': os.getenv('MONGO_URL'),
        'db_username': os.getenv('MONGO_USER'),
        'db_password': os.getenv('MONGO_PASSWORD'),
        'max_db_conn_count': os.getenv('MAX_CONNECTIONS_COUNT'),
        'min_db_conn_count': os.getenv('MIN_CONNECTIONS_COUNT'),
    }

    # These three are only required when mongo_uri is NOT set.
    _uri_replaces = {'mongodb_url', 'db_username', 'db_password'}

    jwt_settings = {
        'jwt_secret': os.getenv('JWT_SECRET'),
        'jwt_alg': os.getenv('JWT_ALG', 'HS256'),
        'access_token_expires_min': os.getenv('ACCESS_TOKEN_EXPIRES_MIN', '15'),
        'refresh_token_expires_days': os.getenv('REFRESH_TOKEN_EXPIRES_DAYS', '14'),
    }

    @classmethod
    def app_settings_validate(cls):
        using_uri = bool(cls.mongo_uri)
        for k, v in cls.app_settings.items():
            if using_uri and k in cls._uri_replaces:
                logging.info(f'Config variable {k} skipped (MONGO_URI in use)')
                continue
            if not v:  # catches None and empty string ""
                logging.error(f'Config variable error. {k} cannot be empty')
                raise InternalError([{"message": "Server configure error"}])
            else:
                logging.info(f'Config variable {k} is {v}')

        for k, v in cls.jwt_settings.items():
            if None is v:
                logging.error(f'Config variable error. {k} cannot be None')
                raise InternalError([{"message": "Server configure error"}])
            else:
                logging.info(f'Config variable {k} is {v}')
