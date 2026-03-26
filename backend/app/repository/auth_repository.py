import logging
from datetime import UTC, datetime
from typing import Optional
from uuid import UUID, uuid4

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.user_model import RefreshTokenDB, UserDB

logger = logging.getLogger(__name__)

_USERS = "users"
_REFRESH_TOKENS = "refresh_tokens"


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _to_uuid(value: UUID | str) -> UUID:
    if isinstance(value, UUID):
        return value
    return UUID(str(value))


async def ensure_indexes(conn: AsyncIOMotorDatabase) -> None: # type: ignore
    await conn[_USERS].create_index("email", unique=True)
    await conn[_REFRESH_TOKENS].create_index("jti", unique=True)
    await conn[_REFRESH_TOKENS].create_index("user_id")
    logger.info("Auth indexes ensured.")

    await conn[_REFRESH_TOKENS].create_index("expires_at", expireAfterSeconds=0)


async def create_user(
    conn: AsyncIOMotorDatabase, # type: ignore
    email: str,
    password_hash: str,
    name: Optional[str] = None,
    roles: Optional[list[str]] = None,
) -> UserDB:
    normalized_email = _normalize_email(email)

    user = UserDB(
        id=uuid4(),
        email=normalized_email,
        password_hash=password_hash,
        name=name,
        roles=roles or ["USER"],
        is_active=True,
        created_at=datetime.now(UTC),
    )

    await conn[_USERS].insert_one(user.mongo())
    logger.info("User created: %s", normalized_email)
    return user


async def get_user_by_email(
    conn: AsyncIOMotorDatabase, # type: ignore
    email: str,
) -> Optional[dict]:
    normalized_email = _normalize_email(email)
    return await conn[_USERS].find_one({"email": normalized_email})


async def get_user_by_id(
    conn: AsyncIOMotorDatabase, # type: ignore
    user_id: UUID | str,
) -> Optional[dict]:
    return await conn[_USERS].find_one({"_id": _to_uuid(user_id)})


async def create_refresh_token_record(
    conn: AsyncIOMotorDatabase, # type: ignore  
    user_id: UUID | str,
    jti: str,
    expires_at: datetime,
) -> RefreshTokenDB:
    record = RefreshTokenDB(
        id=uuid4(),
        user_id=_to_uuid(user_id),
        jti=jti,
        expires_at=expires_at,
        revoked=False,
        created_at=datetime.now(UTC),
    )

    await conn[_REFRESH_TOKENS].insert_one(record.mongo())
    logger.info("Refresh token record created for jti=%s", jti)
    return record


async def get_refresh_token_by_jti(
    conn: AsyncIOMotorDatabase, # type: ignore
    jti: str,
) -> Optional[dict]:
    return await conn[_REFRESH_TOKENS].find_one({"jti": jti})


async def revoke_refresh_token(
    conn: AsyncIOMotorDatabase, # type: ignore
    jti: str,
) -> None:
    await conn[_REFRESH_TOKENS].update_one(
        {"jti": jti},
        {"$set": {"revoked": True}},
    )
    logger.info("Refresh token revoked: jti=%s", jti)