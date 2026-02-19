# DB-access layer for auth collections.
# Follows the same pattern as schemas/sample_resource.py.
import logging
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from app.conf.config import Config
from app.db.db import AsyncIOMotorClient
from app.models.user_model import UserDB, RefreshTokenDB

_USERS = 'users'
_REFRESH_TOKENS = 'refresh_tokens'


def _db(conn: AsyncIOMotorClient):
    return conn[Config.app_settings.get('db_name')]


# ---------------------------------------------------------------------------
# Index bootstrapping
# ---------------------------------------------------------------------------

async def ensure_indexes(conn: AsyncIOMotorClient) -> None:
    await _db(conn)[_USERS].create_index('email', unique=True)
    logging.info('Auth indexes ensured.')


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

async def create_user(
    conn: AsyncIOMotorClient,
    email: str,
    password_hash: str,
    name: Optional[str] = None,
    roles: Optional[list] = None,
) -> UserDB:
    if roles is None:
        roles = ["USER"]
    user = UserDB(
        id=uuid4(),
        email=email,
        password_hash=password_hash,
        name=name,
        roles=roles,
        is_active=True,
        created_at=datetime.utcnow(),
    )
    await _db(conn)[_USERS].insert_one(user.mongo())
    logging.info(f'User created: {email}')
    return user


async def get_user_by_email(
    conn: AsyncIOMotorClient,
    email: str,
) -> Optional[dict]:
    return await _db(conn)[_USERS].find_one({'email': email})


async def get_user_by_id(
    conn: AsyncIOMotorClient,
    user_id: UUID,
) -> Optional[dict]:
    return await _db(conn)[_USERS].find_one({'_id': user_id})


# ---------------------------------------------------------------------------
# Refresh tokens
# ---------------------------------------------------------------------------

async def create_refresh_token_record(
    conn: AsyncIOMotorClient,
    user_id: UUID,
    jti: str,
    expires_at: datetime,
) -> RefreshTokenDB:
    record = RefreshTokenDB(
        id=uuid4(),
        user_id=user_id,
        jti=jti,
        expires_at=expires_at,
        revoked=False,
        created_at=datetime.utcnow(),
    )
    await _db(conn)[_REFRESH_TOKENS].insert_one(record.mongo())
    logging.info(f'Refresh token record created for jti={jti}')
    return record


async def get_refresh_token_by_jti(
    conn: AsyncIOMotorClient,
    jti: str,
) -> Optional[dict]:
    return await _db(conn)[_REFRESH_TOKENS].find_one({'jti': jti})


async def revoke_refresh_token(
    conn: AsyncIOMotorClient,
    jti: str,
) -> None:
    await _db(conn)[_REFRESH_TOKENS].update_one(
        {'jti': jti},
        {'$set': {'revoked': True}},
    )
    logging.info(f'Refresh token revoked: jti={jti}')
