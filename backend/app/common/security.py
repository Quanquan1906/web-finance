import logging
from datetime import datetime, timedelta
from uuid import UUID, uuid4

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.conf.config import Config
from app.common.error import UnauthorizedError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: UUID, roles: list[str]) -> str:
    expire = datetime.utcnow() + timedelta(
        minutes=int(Config.jwt_settings["access_token_expires_min"])
    )
    payload = {
        "sub": str(user_id),
        "type": TOKEN_TYPE_ACCESS,
        "roles": roles,
        "exp": expire,
    }
    return jwt.encode(
        payload,
        Config.jwt_settings["jwt_secret"],
        algorithm=Config.jwt_settings["jwt_alg"],
    )


def create_refresh_token(user_id: UUID) -> tuple[str, str, datetime]:
    """Returns (encoded_token, jti, expires_at)."""
    jti = str(uuid4())
    expire = datetime.utcnow() + timedelta(
        days=int(Config.jwt_settings["refresh_token_expires_days"])
    )
    payload = {
        "sub": str(user_id),
        "type": TOKEN_TYPE_REFRESH,
        "jti": jti,
        "exp": expire,
    }
    token = jwt.encode(
        payload,
        Config.jwt_settings["jwt_secret"],
        algorithm=Config.jwt_settings["jwt_alg"],
    )
    return token, jti, expire


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            Config.jwt_settings["jwt_secret"],
            algorithms=[Config.jwt_settings["jwt_alg"]],
        )
        return payload
    except JWTError as e:
        logging.warning(f"JWT decode error: {e}")
        raise UnauthorizedError([{"message": "Invalid or expired token"}])
